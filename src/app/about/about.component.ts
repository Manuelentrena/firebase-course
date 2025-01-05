import { Component, OnInit } from "@angular/core";

import "firebase/firestore";

import { AngularFirestore } from "@angular/fire/firestore";
import { COURSES, findLessonsForCourse } from "./db-data";
import { Course } from "../model/course";
import { Lesson } from "../model/lesson";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent {
  constructor(private db: AngularFirestore) {}

  async uploadData() {
    const coursesCollection = this.db.collection("courses");
    const courses = await this.db.collection("courses").get();
    for (let course of Object.values(COURSES)) {
      const newCourse = this.removeId(course);
      const courseRef = await coursesCollection.add(newCourse);
      const lessons = await courseRef.collection("lessons");
      const courseLessons = findLessonsForCourse(course["id"]);
      console.log(`Uploading course ${course["description"]}`);
      for (const lesson of courseLessons) {
        const newLesson = this.removeId(lesson);
        delete newLesson.courseId;
        await lessons.add(newLesson);
      }
    }
  }

  removeId(data: any) {
    const newData: any = { ...data };
    delete newData.id;
    return newData;
  }

  public onReadDoc() {
    this.db
      .doc("/courses/1Kpm2WyI1yqBZLlK9YjE")
      .get()
      .subscribe((course) => {
        console.log(course.id);
        console.log(course.data());
      });
  }

  public onReadDocRealTime() {
    this.db
      .doc("/courses/1Kpm2WyI1yqBZLlK9YjE")
      .snapshotChanges()
      .subscribe((course) => {
        console.log(course.payload.id);
        console.log(course.payload.data());
      });
  }

  public onReadCollection() {
    this.db
      .collection<Course>("courses", (ref) =>
        ref
          .where("seqNo", "<=", 10)
          .where("url", "==", "angular-router-course")
          .orderBy("seqNo")
      )
      .get()
      .subscribe((courses) => {
        courses.forEach((course) => {
          console.log(course.id);
          console.log(course.data());
        });
      });
  }

  public onReadNumberOfDocs() {
    this.db
      .collection<Course>("courses")
      .get()
      .subscribe((courses) => {
        console.log(courses.size);
      });
  }

  public onReadCollectionGroup() {
    this.db
      .collectionGroup<Lesson>("lessons", (ref) => ref.where("seqNo", "<=", 10))
      .get()
      .subscribe((lessons) => {
        lessons.forEach((lesson) => {
          console.log(lesson.data());
        });
      });
  }

  public onTotalTimeLessons() {
    this.db
      .collectionGroup<Lesson>("lessons")
      .get()
      .subscribe((lessons) => {
        let total_duration = 0;
        lessons.forEach((lesson) => {
          const { duration } = lesson.data();
          total_duration += this.durationToSeconds(duration);
        });
        console.log("total de lecciones es:", this.formatTime(total_duration));
      });
  }

  private durationToSeconds(duration) {
    const [minutes, seconds] = duration.split(":").map(Number);
    return minutes * 60 + seconds;
  }

  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
}
