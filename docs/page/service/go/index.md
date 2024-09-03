# Go
## hello go

```go
package main // 包名
import "fmt" // 导入包

// 主函数
func main()  {
	fmt.Println("hello world")
}
```
### 运行
```bash
# 生成可执行文件 hello.exe
go build hello.go 
# 编译后 直接运行
go run hello.go
```
### 格式化 gofmt
```bash
# 打印格式化后的代码
gofmt hello.go
# 格式化代码
gofmt -w hello.go
```

## 变量
### 局部变量
```go
package main 
import "fmt"
func main() {
	fmt.Println("hello world")

	var age int = 18
	fmt.Println("age:", age)

	var age1 int
	fmt.Println("age1:", age1) // 0

	var age2 = 18
	fmt.Println("age2:", age2)

	name := "mz"
	fmt.Println("name:", name) 

	var n1, n2, n3 int
	fmt.Println(n1, n2, n3)

	var n4, n5, n6 int = 4, 5, 6
	fmt.Println(n4, n5, n6)

	n7, n8 := 7, 8
	fmt.Println(n7, n8)
}
```

### 全局变量
```go
var g1 = 1
var g2 = 2
var (
	g3 = 3
	g4 = 4
)
func main() {
	fmt.Println(g1, g2, g3, g4)
}
```

## 数据类型