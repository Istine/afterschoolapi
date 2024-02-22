import express from "express";

export type ExpressType = ReturnType<typeof express>;

export type loginData = { email: string; password: string };

export type courseType = {
  title: string;
  description: string;
  videoTrailerUrl: string;
  courseObjectives: Array<string>;
  duration: string;
  price: number;
  language: string;
  bannerImageUrl: string;
  teachers: Array<string>;
  thumbnail: string;
  category: string;
};

export type courseMaterialType = {
  title: string;
  url: string;
  moduleId: string;
};

export type courseMaterialInputType = {
  title: string;
  url: string;
  moduleId: string;
  id: string;
};

export type moduleType = {
  title: string;
  lessons: string[];
  duration: string;
};

export type lessonType = {
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  moduleId?: string;
};

export type courseCreationType = {
  course: courseType;
  modules: Array<moduleType>;
};

export type instructorType = {
  firstName: string;
  lastName: string;
  imageUrl: string;
  specialization: string;
  email: string;
  bio: string;
  resourceKey: string;
  id?: string;
};

export type instructorKeyType =
  | "firstName"
  | "lastName"
  | "imageUrl"
  | "specialization"
  | "email"
  | "bio"
  | "resourceKey"
  | "id";
