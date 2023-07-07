interface IUser {
  name: string;
  age: number;
  sex?: number;
}

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

let k:K = 'age'
