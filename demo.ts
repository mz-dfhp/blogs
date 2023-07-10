type IUser = {
  name: string;
  age: number;
  sex?: number;
};

type T = keyof IUser;

type IUser2 = {
  [key in T]: string;
};

const user: IUser = {
  name: "mz",
  age: 18,
  sex: 1,
};

type U = typeof user;
type K = keyof typeof user;

let k: K = "age";

type R = Record<"name" | "age" | "sex", string>;

const r: R = {
  name: "mz",
  age: "18",
  sex: "1",
};

type P = Pick<IUser, "name" | "age">;

const p: P = {
  name: "mz",
  age: 18,
};

type Person = {
  name: string;
  age?: number;
  sex: number;
};

type PersonInfo = Readonly<Person>;

// type Animal = "cat" | "dog" | "rabbit" | "hamster";
// type ExcludeAnimal = Exclude<Animal, "rabbit" | "hamster">;

// const animals: ExcludeAnimal[] = ["cat", "dog"];

type Animal = "cat" | "dog" | "rabbit" | "hamster";
type ExtractedAnimal = Extract<Animal, "rabbit" | "hamster">;

const animals: ExtractedAnimal[] = ["rabbit", "hamster"];


type OmitUser = Omit<IUser, "name" | "age">;

// type OmitUser = {
//   sex?: number | undefined;
// };
