import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { CoursesService } from "../services/courses.service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  public beginnersCourses$: Observable<Course[]>;
  public urlCourseId: string | null = null;
  public advancedCourses$: Observable<Course[]>;
  public filterCourse$: Observable<Course[]>;

  constructor(
    private router: Router,
    private courseService: CoursesService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
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

    this.filterCourse$.subscribe((courses) => {
      this.cdRef.detectChanges(); // Forzar la detección de cambios
    });
  }

  public loadCourses() {
    this.beginnersCourses$ =
      this.courseService.loadCoursesByCategory("BEGINNER");
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
