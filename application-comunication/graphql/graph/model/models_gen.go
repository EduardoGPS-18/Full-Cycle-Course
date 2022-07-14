// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type NewCategory struct {
	Name        string  `json:"name"`
	Description *string `json:"description"`
}

type NewChapter struct {
	Name     string `json:"name"`
	CourseID string `json:"courseId"`
}

type NewCourse struct {
	Name        string  `json:"name"`
	CategoryID  string  `json:"categoryId"`
	Description *string `json:"description"`
}
