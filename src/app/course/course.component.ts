import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {finalize, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import { CoursesService } from '../services/courses.service';


@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit {
  public loading = false;
  public course: Course;
  public lessons: Lesson[] = [];
  public currentPage: number = 0;
  public orderLessons: "asc" | "desc" = "asc";

  public displayedColumns = ["seqNo", "description", "duration"];

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService
  ) {}

  ngOnInit() {
    this.course = this.route.snapshot.data["course"];
    this.loadLessons();
  }

  private loadLessons(): void {
    this.loading = true;
    this.coursesService
      .findLessons(this.course.id, this.orderLessons, this.currentPage)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (newLessons: Lesson[]) => {
          this.lessons = this.lessons.concat(newLessons);
        },
        error: (err) => {
          console.error("Error loading lessons:", err);
        },
      });
  }

  public nextPage() {
    this.currentPage += 1;
    this.loadLessons();
  }
}
