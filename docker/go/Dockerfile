FROM golang as Builder

WORKDIR /
COPY ./main.go main.go
RUN go build -o main main.go

FROM scratch

COPY --from=Builder /main /main
ENTRYPOINT ["/main"]
