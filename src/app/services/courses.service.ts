import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import firebase from "firebase/app";
import { map } from "rxjs/operators";
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
}
