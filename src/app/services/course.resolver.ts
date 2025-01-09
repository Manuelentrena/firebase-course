import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { CoursesService } from "./courses.service";
import { Course } from "../model/course";
import { Observable } from "rxjs";
import { Inject, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CourseResolver implements Resolve<Course> {
  constructor(private coursesService: CoursesService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Course> {
    const courseUrl = route.paramMap.get("courseUrl");
    return this.coursesService.loadCourseByUrl(courseUrl);
  }
}
