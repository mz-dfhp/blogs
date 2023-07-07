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

interface IUser {
  name: string;
  age: number;
  sex?: number;
}

type U = typeof user // 此时 U 类型 与 IUser 类型一样
type K = keyof typeof user; // // "name" | "age" | "sex"
```
#### Record
#### Pick
#### Partial
#### Required
#### Readonly
#### Exclude
#### Extract
#### Omit