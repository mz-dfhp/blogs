---
outline: deep
---

## typeScript 

### 基本使用


### 高级使用

#### keyof
获取一个类型的所有属性名称组成的联合类型。

```ts
interface IUser {
  name: string;
  age: number;
  sex?: number;
}

type T = keyof IUser; // "name" | "age" | "sex"
type S = keyof any; // "string" | "number" | "symbol"

```
#### in
映射类型语法

```ts
interface IUser {
  name: string;
  age: number;
  sex?: number;
}

type T = keyof IUser;

type IUser2 = {
  [key in T]: string;
};

// 等于
// type IUser2 = {
//     name: string;
//     age: string;
//     sex: string;
// }


```
#### typeof
获取一个类型的所有属性名称组成的联合类型。
```ts
console.log(typeof undefined); // 输出 "undefined"
console.log(typeof true); // 输出 "boolean"
console.log(typeof 42); // 输出 "number"
console.log(typeof "hello"); // 输出 "string"
console.log(typeof { name: "Alice" }); // 输出 "object"
console.log(typeof [1, 2, 3]); // 输出 "object"
console.log(typeof null); // 输出 "object"
console.log(typeof function () {}); // 输出 "function"
console.log(typeof Symbol("foo")); // 输出 "symbol"

type IUser =  {
  name: string;
  age: number;
  sex?: number;
}

type U = typeof user; // 此时 U 类型 与 IUser 类型一样
type K = keyof typeof user; // // "name" | "age" | "sex"
```
#### Record 
创建具有指定属性键和对应值类型的对象类型 

- 语法：Record<K, V>
- K 表示属性键的集合
- V 表示属性值的类型


```ts
// 源码
type Record<K extends keyof any, T> = {
    [P in K]: T;
};

// 指定属性键集合和值类型的对象类型
type R = Record<"name" | "age" | "sex", string>;

const r: R = {
  name: "mz",
  age: "18",
  sex: "1",
};

// 指定所有属性键都具有相同的值类型
type S = Record<string, number>;

const s: S = {
  age: 18,
  sex: 1,
};

```
#### Pick
从给定类型中选择指定属性的子集，创建一个新的类型

语法：Pick<T, K>
- T 表示源类型，即要从中选择属性的类型
- K 表示需要选择的属性键的联合类型

```ts
// 源码
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

type Person = {
  name: string;
  age: number;
  sex: number;
};

type PersonInfo = Pick<Person, "name" | "sex">;

const personInfo: PersonInfo = {
  name: "mz",
  sex: 1
};
```

使用 Pick<Person, "name" | "sex"> 创建了一个 PersonInfo 类型。它从 Person 类型中选择了 "name" 和 "sex" 这两个属性，生成了一个新的子类型 PersonInfo。因此，personInfo 对象只包含 name 和 sex 属性，而没有其他属性。

#### Partial
将给定类型的所有属性转换为可选项，创建一个新的类型

语法：Partial< T >
- T 表示源类型，即要进行属性转换的类型

```ts
// 源码
type Partial<T> = {
    [P in keyof T]?: T[P];
};

type Person = {
  name: string;
  age: number;
  sex: number;
};

type PersonInfo = Partial<Person>

// 等同于
type PersonInfo = {
  name?: string | undefined;
  age?: number | undefined;
  sex?: number | undefined;
}
```

#### Required
将给定类型的所有属性转换为必需项，创建一个新的类型

语法：Required< T >
- T 表示源类型，即要进行属性转换的类型

```ts
// 源码
type Required<T> = {
    [P in keyof T]-?: T[P];
};

type Person = {
  name?: string;
  age?: number;
  sex?: number;
};

type PersonInfo = Required<Person>;

const requiredPerson: PersonInfo = {
  name: "mz",
  age: 18,
  sex: 1,
};
```

#### Readonly
将给定类型的所有属性设置为只读，创建一个新的类型

语法：Readonly< T >
- T 表示源类型，即要进行属性转换的类型

```ts
// 源码
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

type Person = {
  name: string;
  age?: number;
  sex: number;
};

type PersonInfo = Readonly<Person>;

// 等同于
type PersonInfo = {
    readonly name: string;
    readonly age?: number | undefined;
    readonly sex: number;
}
```
#### Exclude
从一个类型中排除另一个类型的成员，创建一个新的类型

语法：Exclude<T, U>
- T表示源类型，即要进行成员排除的类型
- U表示要从源类型中排除的成员类型

```ts
// 源码
type Exclude<T, U> = T extends U ? never : T;

type Animal = "cat" | "dog" | "rabbit" | "hamster";
type ExcludeAnimal = Exclude<Animal, "rabbit" | "hamster">;

const animals: ExcludeAnimal[] = ["cat", "dog"];
```
Exclude<T, U> 将类型 T 中与类型 U 相同的成员排除，生成一个新的类型。

#### Extract
从联合类型中提取满足条件的成员类型，创建一个新的类型。

语法：Extract<T, U>
- T表示源类型，即要进行成员提取的联合类型
- U表示要从源类型中提取的成员类型

```ts
// 源码
type Extract<T, U> = T extends U ? T : never;

type Animal = "cat" | "dog" | "rabbit" | "hamster";
type ExtractedAnimal = Extract<Animal, "rabbit" | "hamster">;

const animals: ExtractedAnimal[] = ["rabbit", "hamster"];
```
Extract<T, U> 将类型 T 中与类型 U 相同的成员，生成一个新的类型。
#### Omit
用于从对象类型中排除指定的属性，创建一个新的类型。

语法：Omit<T, K>

- 表示源类型，即要进行属性排除的对象类型
- 表示要从源类型中排除的属性名或属性名的联合类型

```ts
// 源码 
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

type IUser = {
  name: string;
  age: number;
  sex?: number;
  address: string;
};

type OmitUser = Omit<IUser, "name" | "age">;

type OmitUser = {
  sex?: number | undefined;
  address: string;
};
```