package services

import (
	"context"
	"fmt"
	"io"
	"log"
	"time"

	"github.com/eduardogps-18/grpc/pb"
)

type UserService struct {
	pb.UnimplementedUserServiceServer
}

func (u *UserService) GetUser(ctx context.Context, req *pb.User) (*pb.User, error) {
	return &pb.User{
		Id:    "123",
		Name:  req.Name,
		Email: req.Email,
	}, nil
}

func (u *UserService) AddUser(ctx context.Context, req *pb.User) (*pb.User, error) {
	fmt.Printf("Adding user %v\n", req.Name)
	return &pb.User{
		Id:    "123",
		Name:  req.Name,
		Email: req.Email,
	}, nil
}

func (u *UserService) AddUserVerbose(req *pb.User, stream pb.UserService_AddUserVerboseServer) error {
	stream.Send(&pb.UserResultStream{
		Status: "INIT",
		User:   &pb.User{},
	})
	time.Sleep(time.Second * 3)

	stream.Send(&pb.UserResultStream{
		Status: "INSERTING",
		User:   &pb.User{},
	})
	time.Sleep(time.Second * 3)

	stream.Send(&pb.UserResultStream{
		Status: "INSERTED",
		User: &pb.User{
			Id:    "123",
			Name:  req.GetName(),
			Email: req.GetEmail(),
		},
	})
	time.Sleep(time.Second * 3)

	stream.Send(&pb.UserResultStream{
		Status: "COMPLETED",
		User: &pb.User{
			Id:    "123",
			Name:  req.GetName(),
			Email: req.GetEmail(),
		},
	})
	fmt.Printf("Added user %v\n", req.GetName())
	return nil
}

func (u *UserService) AddUsers(stream pb.UserService_AddUsersServer) error {
	users := []*pb.User{}

	for {
		req, err := stream.Recv()
		if err == io.EOF {
			return stream.SendAndClose(&pb.Users{
				User: users,
			})
		}
		if err != nil {
			log.Fatalf("Error while reading client stream: %v", err)
		}
		users = append(users, &pb.User{
			Id:    req.GetId(),
			Name:  req.GetName(),
			Email: req.GetEmail(),
		})
		fmt.Println("Adding ", req.GetName())
	}
}

func (u *UserService) AddUserStreamBoth(stream pb.UserService_AddUserStreamBothServer) error {
	for {
		req, err := stream.Recv()
		if err == io.EOF {
			return nil
		}
		if err != nil {
			log.Fatalf("Error while reading client stream: %v", err)
		}
		fmt.Println("Adding ", req.GetName())
		err = stream.Send(&pb.UserResultStream{
			Status: "INSERTED",
			User: &pb.User{
				Id:    req.GetId(),
				Name:  req.GetName(),
				Email: req.GetEmail(),
			},
		})
		if err != nil {
			log.Fatalf("Error while sending data to client: %v", err)
		}
	}
}

func NewUserService() *UserService {
	return &UserService{}
}
