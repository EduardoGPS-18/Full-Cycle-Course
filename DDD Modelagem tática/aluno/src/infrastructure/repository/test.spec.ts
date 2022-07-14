import { Column, DataSource, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Repository } from "typeorm";

@Entity()
export class LibraryModel {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @OneToMany(() => BookModel, (book) => book.library, { cascade: ["insert"] })
  books: BookModel[];
}

@Entity()
export class BookModel {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Column()
  name: string;
  @ManyToOne(() => LibraryModel, (library) => library.books)
  library: LibraryModel;
}

describe("Customer Repository tests", () => {
  let dataSource: DataSource;
  let ormBookRepository: Repository<BookModel>;
  let ormLibraryRepository: Repository<LibraryModel>;

  beforeEach(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      logging: false,
      synchronize: true,
      migrations: [],
      entities: [LibraryModel, BookModel],
    });
    await dataSource.initialize();
    ormBookRepository = dataSource.getRepository(BookModel);
    ormLibraryRepository = dataSource.getRepository(LibraryModel);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  it("mtest", async () => {});
});
