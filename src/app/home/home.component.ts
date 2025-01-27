import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { CoursesService } from "../services/courses.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  public urlCourseId: string | null = null;
  public beginnersCourses$: Observable<Course[]>;
  public intermediateCourses$: Observable<Course[]>;
  public advancedCourses$: Observable<Course[]>;
  public filterCourse$: Observable<Course[]>;

  constructor(
    private router: Router,
    private courseService: CoursesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.readCourseId();
  }

  private readCourseId() {
    this.route.paramMap.subscribe((params) => {
      this.urlCourseId = params.get("id") ?? null;
      if (this.urlCourseId) {
        this.loadCoursebyId();
      } else {
        this.loadCourses();
      }
    });
  }

  public loadCoursebyId() {
    if (!this.urlCourseId) {
      this.filterCourse$ = of([]);
      return;
    }

    this.filterCourse$ = this.courseService
      .loadCourseById(this.urlCourseId)
      .pipe(map((course) => [course]));
  }

  public loadCourses() {
    this.beginnersCourses$ =
      this.courseService.loadCoursesByCategory("BEGINNER");
    this.intermediateCourses$ =
      this.courseService.loadCoursesByCategory("INTERMEDIATE");
    this.advancedCourses$ =
      this.courseService.loadCoursesByCategory("ADVANCED");
  }

  public reloadCourses(course: Course) {
    if (this.urlCourseId) {
      this.loadCoursebyId();
    } else {
      this.loadCourses();
    }
  }
}
