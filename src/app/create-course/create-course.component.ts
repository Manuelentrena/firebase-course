import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { Course } from "../model/course";
import { catchError, concatMap, last, map, take, tap } from "rxjs/operators";
import { from, Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { AngularFireStorage } from "@angular/fire/storage";
import firebase from "firebase/app";
import Timestamp = firebase.firestore.Timestamp;
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "create-course",
  templateUrl: "create-course.component.html",
  styleUrls: ["create-course.component.css"],
})
export class CreateCourseComponent implements OnInit {
  // Form group
  public form: FormGroup = this.fb.group({
    description: ["", Validators.required],
    category: ["", Validators.required],
    url: ["", Validators.required],
    longDescription: ["", Validators.required],
    promo: ["", Validators.required],
    promoStartAt: ["", Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private courseService: CoursesService,
    private router: Router
  ) {}

  ngOnInit() {}

  public onCreateCourse() {

    const values = this.form.value;

    const newCourse: Partial<Course> = {
      ...values,
      categories: [values.category],
      promoStartAt: Timestamp.fromDate(values.promoStartAt),
    };

    this.courseService
      .createCourse(newCourse, this.createId())
      .pipe(
        tap((course) => {
          console.log("Course created successfully.", course);
          this.router.navigateByUrl("/courses");
        }),
        catchError((err) => {
          console.error(err);
          alert("Cloud not create the course.")
          return throwError(err);
        }),
      )
      .subscribe();
  }

  private createId() {
    return this.afs.createId();
  }
}
