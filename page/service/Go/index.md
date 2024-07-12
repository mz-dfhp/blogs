# Go
## 1. hello.go

```go
package main // 包名
import "fmt" // 导入包

// 主函数
func main()  {
	fmt.Println("hello world")
}
```

```bash
// 生成可执行文件 hello.exe
go build hello.go
// 编译后 直接运行
go run hello.go 
```
