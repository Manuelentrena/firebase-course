import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {CourseComponent} from './course/course.component';
import {LoginComponent} from './login/login.component';
import {CreateCourseComponent} from './create-course/create-course.component';
import {AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {CreateUserComponent} from './create-user/create-user.component';
import { CourseResolver } from './services/course.resolver';

const routes: Routes = [
  {
    path: "create-course",
    component: CreateCourseComponent,
  },
  {
    path: "create-user",
    component: CreateUserComponent,
  },
  {
    path: "about",
    component: AboutComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "courses",
    component: HomeComponent,
  },
  {
    path: "courses/:courseUrl",
    component: CourseComponent,
    resolve: {
      course: CourseResolver,
    },
  },
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: ":id",
    component: HomeComponent,
  },
  {
    path: "**",
    redirectTo: "/",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
