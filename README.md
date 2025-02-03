# nest-demo

使用 nestjs 搭建 后台管理系统、vue3 搭建前端、包含 jwt、数据库、redis、sso、等

## 项目结构

```
├── admin-dashboard
│   ├── public
│   ├── src
│   ├── .gitignore
│   ├── babel.config.js
│   ├── jsconfig.json
│   ├── package.json
│   ├── README.md
│   ├── tsconfig.json
│   └── vue.config.js
├── nest-demo
│   ├── src
│   ├── .gitignore
│   ├── README.md
│   ├── tsconfig.json
│   └── package.json
└── server
    ├── src
    ├── .gitignore
    ├── README.md
    ├── tsconfig.json
    └── package.json
```

## 项目启动

```
1. 安装依赖
    npm install
```

## nest 快捷操作

```bash

nest g resource [name]  // 创建资源  包含Module、实体、controller、service等
nest g module [name]  // 创建模块
nest g controller [name]  // 创建控制器
nest g service [name]  // 创建服务
nest g class [name]  // 创建类
nest g guard [name]  // 创建守卫
nest g interceptor [name]  // 创建拦截器
nest g filter [name]  // 创建过滤器
nest g decorator [name]  // 创建装饰器
nest g pipe [name]  // 创建管道

nest g class users/entities/user --no-spec   # 创建用户实体类


```
