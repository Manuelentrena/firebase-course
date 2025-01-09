import { Component, Inject, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: "app-delete-course-dialog",
  templateUrl: "./delete-course-dialog.component.html",
  styleUrls: ["./delete-course-dialog.component.css"],
})
export class DeleteCourseDialogComponent {
  public course: Course;
  constructor(
    private dialogRef: MatDialogRef<DeleteCourseDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private courseService: CoursesService
  ) {
    this.course = course;
  }

  public close() {
    this.dialogRef.close(false);
  }

  public delete() {
    this.courseService.deleteCourseAndLessons(this.course.id).subscribe(() => {
      this.dialogRef.close(this.course);
    });
  }
}
