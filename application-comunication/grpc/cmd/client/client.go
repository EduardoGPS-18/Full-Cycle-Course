package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"os"
	"time"

	"github.com/eduardogps-18/grpc/pb"
	"google.golang.org/grpc"
)

func main() {
	connection, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Could not connect to gRPC Server: %v", err)
	}
	defer connection.Close()

	client := pb.NewUserServiceClient(connection)
	AddUserStreamBoth(client)
}

func AddUser(client pb.UserServiceClient) {
	user := &pb.User{
		Id:    "0",
		Name:  "Eduardo",
		Email: "e@e.com",
	}
	res, err := client.AddUser(context.Background(), user)

	if err != nil {
		log.Fatalf("Could not make gRPC request: %v", err)
	}
	fmt.Printf("Response: %v", res)
}

func AddUserVerbose(client pb.UserServiceClient) {
	id, name, email := os.Args[1], os.Args[2], os.Args[2]
	user := &pb.User{
		Id:    id,
		Name:  name,
		Email: email,
	}

	responseStream, err := client.AddUserVerbose(context.Background(), user)
	if err != nil {
		log.Fatalf("Could not make gRPC request: %v", err)
	}

	for {
		stream, err := responseStream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatalf("Could not read stream: %v", err)
		}
		fmt.Printf("Status: %v\n", stream.Status)
		if stream.Status == "COMPLETED" {
			fmt.Printf("User: %v\n", stream.User)
		}
	}
}

func AddUsers(client pb.UserServiceClient) {

	users := []*pb.User{
		{
			Id:    "e1",
			Name:  "edu",
			Email: "edu@e.com",
		},
		{
			Id:    "e2",
			Name:  "edu2",
			Email: "edu2@e.com",
		},
		{
			Id:    "e3",
			Name:  "edu3",
			Email: "edu3@e.com",
		},
		{
			Id:    "e4",
			Name:  "edu4",
			Email: "edu4@e.com",
		},
		{
			Id:    "e5",
			Name:  "edu5",
			Email: "edu5@e.com",
		},
	}
	stream, err := client.AddUsers(context.Background())
	if err != nil {
		log.Fatalf("Could not make gRPC request: %v", err)
	}
	for _, req := range users {
		stream.Send(req)
		time.Sleep(time.Second * 3)
	}
	res, err := stream.CloseAndRecv()
	if err != nil {
		log.Fatalf("Could not make gRPC request: %v", err)
	}
	fmt.Printf("Response: %v", res)
}

func AddUserStreamBoth(client pb.UserServiceClient) {
	users := []*pb.User{
		{
			Id:    "e1",
			Name:  "edu",
			Email: "edu@e.com",
		},
		{
			Id:    "e2",
			Name:  "edu2",
			Email: "edu2@e.com",
		},
		{
			Id:    "e3",
			Name:  "edu3",
			Email: "edu3@e.com",
		},
		{
			Id:    "e4",
			Name:  "edu4",
			Email: "edu4@e.com",
		},
		{
			Id:    "e5",
			Name:  "edu5",
			Email: "edu5@e.com",
		},
	}

	stream, err := client.AddUserStreamBoth(context.Background())
	if err != nil {
		log.Fatalf("Could not make gRPC request: %v", err)
	}

	wait := make(chan int)

	go func() {
		for _, req := range users {
			fmt.Println("Sending user: ", req.Name)
			stream.Send(req)
			time.Sleep(time.Second * 2)
		}
		stream.CloseSend()
	}()
	go func() {
		for {
			res, err := stream.Recv()
			if err == io.EOF {
				break
			}
			if err != nil {
				log.Fatalf("Could not read stream: %v", err)
				break
			}
			fmt.Printf("User %v => %v\n", res.User.Name, res.Status)
		}
		close(wait)
	}()

	<-wait
}
