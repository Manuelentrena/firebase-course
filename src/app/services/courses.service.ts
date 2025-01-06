import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { concat, from, Observable } from "rxjs";
import { Course } from "../model/course";
import firebase from "firebase/app";
import { concatMap, map } from "rxjs/operators";
import { convertSnaps } from "../utils";

@Injectable({
  providedIn: "root",
})
export class CoursesService {
  private collectionName = "courses";
  constructor(private db: AngularFirestore) {}

  private buildCourseQuery(
    ref: firebase.firestore.CollectionReference,
    category: string
  ): firebase.firestore.Query {
    return ref.where("categories", "array-contains", category).orderBy("seqNo");
  }

  public loadCoursesByCategory(category: string): Observable<Course[]> {
    return this.db
      .collection<Course>(this.collectionName, (ref) =>
        this.buildCourseQuery(ref, category)
      )
      .get()
      .pipe(map((snaps) => convertSnaps<Course>(snaps)));
  }

  /**
   * Creates a new course with an auto-generated or custom ID.
   */
  public createCourse(
    newCourse: Partial<Course>,
    courseId?: string
  ): Observable<Partial<Course>> {
    return this.getLastCourseSeqNo().pipe(
      concatMap((lastSeqNo) => this.saveCourse(newCourse, courseId, lastSeqNo))
    );
  }

  /**
   * Fetches the highest sequence number (`seqNo`) from the courses collection.
   */
  private getLastCourseSeqNo(): Observable<number> {
    return this.db
      .collection<Course>(this.collectionName, (ref) =>
        ref.orderBy("seqNo", "desc").limit(1)
      )
      .get()
      .pipe(
        map((results) => {
          const courses = convertSnaps<Course>(results);
          return courses[0]?.seqNo ?? 0; // Return 0 if no courses exist
        })
      );
  }

  /**
   * Saves a new course to Firestore, generating the appropriate sequence number and ID.
   */
  private saveCourse(
    newCourse: Partial<Course>,
    courseId: string | undefined,
    lastSeqNo: number
  ): Observable<Partial<Course>> {
    const courseToSave: Partial<Course> = {
      ...newCourse,
      seqNo: lastSeqNo + 1,
    };

    const saveOperation$: Observable<Partial<Course>> = courseId
      ? this.saveCourseWithCustomId(courseId, courseToSave)
      : this.saveCourseWithAutoId(courseToSave);

    return saveOperation$;
  }

  /**
   * Saves a course to Firestore with a custom ID.
   */
  private saveCourseWithCustomId(
    courseId: string,
    course: Partial<Course>
  ): Observable<Partial<Course>> {
    return from(
      this.db.doc(`${this.collectionName}/${courseId}`).set(course)
    ).pipe(
      map(() => ({
        ...course,
        id: courseId,
      }))
    );
  }

  /**
   * Saves a course to Firestore with an auto-generated ID.
   */
  private saveCourseWithAutoId(
    course: Partial<Course>
  ): Observable<Partial<Course>> {
    return from(
      this.db.collection<Partial<Course>>(this.collectionName).add(course)
    ).pipe(
      map((res) => ({
        ...course,
        id: res.id,
      }))
    );
  }

  public updateCourse(courseId: string, changes: Partial<Course>): Observable<void> {
    return from(
      this.db.doc(`${this.collectionName}/${courseId}`).update(changes)
    );
  }

  public deleteCourse(courseId: string){
    return from(this.db.doc(`${this.collectionName}/${courseId}`).delete());
  }
}
