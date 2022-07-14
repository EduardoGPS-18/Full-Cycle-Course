package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/eduardogps-18/graphql/graph/generated"
	"github.com/eduardogps-18/graphql/graph/model"
	"github.com/google/uuid"
)

func (r *categoryResolver) Courses(ctx context.Context, obj *model.Category) ([]*model.Course, error) {
	var courses []*model.Course
	for _, currentCourse := range r.Resolver.Courses {
		if currentCourse.Category.ID == obj.ID {
			courses = append(courses, currentCourse)
		}
	}
	return courses, nil
}

func (r *courseResolver) Chapters(ctx context.Context, obj *model.Course) ([]*model.Chapter, error) {
	var chapters []*model.Chapter
	for _, currentChapter := range r.Resolver.Chapters {
		if currentChapter.Course.ID == obj.ID {
			chapters = append(chapters, currentChapter)
		}
	}
	return chapters, nil
}

func (r *mutationResolver) CreateCategory(ctx context.Context, category *model.NewCategory) (*model.Category, error) {
	newCategory := &model.Category{
		ID:          uuid.New().String(),
		Name:        category.Name,
		Description: category.Description,
	}
	r.Resolver.Categories = append(r.Resolver.Categories, newCategory)
	return newCategory, nil
}

func (r *mutationResolver) CreateChapter(ctx context.Context, chapter *model.NewChapter) (*model.Chapter, error) {
	var course *model.Course
	for _, currentCourse := range r.Resolver.Chapters {
		if currentCourse.ID == chapter.CourseID {
			course = currentCourse.Course
			break
		}
	}

	newChapter := &model.Chapter{
		ID:     uuid.New().String(),
		Name:   chapter.Name,
		Course: course,
	}
	r.Resolver.Chapters = append(r.Resolver.Chapters, newChapter)
	return newChapter, nil
}

func (r *mutationResolver) CreateCourse(ctx context.Context, course *model.NewCourse) (*model.Course, error) {
	var category *model.Category
	for _, currentCategory := range r.Resolver.Categories {
		if currentCategory.ID == course.CategoryID {
			category = currentCategory
			break
		}
	}
	newCourse := model.Course{
		ID:          uuid.New().String(),
		Name:        course.Name,
		Description: course.Description,
		Category:    category,
	}
	r.Resolver.Courses = append(r.Resolver.Courses, &newCourse)
	return &newCourse, nil
}

func (r *queryResolver) Categories(ctx context.Context) ([]*model.Category, error) {
	return r.Resolver.Categories, nil
}

func (r *queryResolver) Chapters(ctx context.Context) ([]*model.Chapter, error) {
	return r.Resolver.Chapters, nil
}

func (r *queryResolver) Courses(ctx context.Context) ([]*model.Course, error) {
	return r.Resolver.Courses, nil
}

// Category returns generated.CategoryResolver implementation.
func (r *Resolver) Category() generated.CategoryResolver { return &categoryResolver{r} }

// Course returns generated.CourseResolver implementation.
func (r *Resolver) Course() generated.CourseResolver { return &courseResolver{r} }

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type categoryResolver struct{ *Resolver }
type courseResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
