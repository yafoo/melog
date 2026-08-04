# Melog Blog API Skill

## Description

This skill provides the ability to manage articles and categories on a Melog blog system via RESTful API. You can list, create, edit, and delete blog articles and categories using token-based authentication.

## When to Use

Use this skill when the user wants to:
- Query, list, or search blog articles
- View article details
- Create new blog articles
- Edit existing blog articles
- Delete blog articles
- Query or list blog categories
- Create, edit, or delete categories

## Authentication

All API requests require a valid token. The token can be passed in two ways:

1. **Query parameter**: `?token=YOUR_TOKEN_STRING`
2. **Authorization header**: `Authorization: Bearer YOUR_TOKEN_STRING`

The token is generated from the blog admin panel (系统管理 → Token管理). Each token has specific permissions (read/create/edit/delete for categories and articles).

## API Base URL

The API endpoints are relative to the blog's base URL. For example: `http://127.0.0.1:3003`

## API Endpoints

### Response Format

All responses follow this format:
- Success: `{"state": 1, "msg": "...", "data": ...}`
- Error: `{"state": 0, "msg": "...", "data": null}`

### Category APIs

#### List Categories

Get all blog categories.

- **URL**: `/api/cate/list`
- **Method**: GET
- **Parameters**: `token` (required)
- **Response**:
```json
{
  "state": 1,
  "msg": "success",
  "data": [
    {
      "id": 1,
      "cate_name": "melog",
      "cate_dir": "melog",
      "seo_title": "",
      "keywords": "melog,blog",
      "description": "A lightweight blog system",
      "sort": 1,
      "is_show": 1
    }
  ]
}
```

#### Get Category Detail

Get details of a specific category.

- **URL**: `/api/cate/detail`
- **Method**: GET
- **Parameters**: `token` (required), `id` (required)
- **Response**:
```json
{
  "state": 1,
  "msg": "success",
  "data": {
    "id": 1,
    "cate_name": "melog",
    "cate_dir": "melog",
    "seo_title": "",
    "keywords": "melog,blog",
    "description": "A lightweight blog system",
    "sort": 1,
    "is_show": 1
  }
}
```

#### Create Category

Create a new blog category.

- **URL**: `/api/cate/create`
- **Method**: POST
- **Parameters**: `token` (required), plus body:
  - `cate_name` (required): Category name
  - `cate_dir` (required): Category directory/slug (URL-friendly, no spaces)
  - `seo_title`: SEO title (optional)
  - `keywords`: SEO keywords, comma-separated (optional)
  - `description`: Category description (optional)
  - `sort`: Sort order, lower number = higher priority (optional, default: 0)
  - `is_show`: Whether to show (1=show, 0=hide, default: 1)
- **Response**:
```json
{
  "state": 1,
  "msg": "新增成功",
  "data": { "id": 2 }
}
```

#### Edit Category

Update an existing category.

- **URL**: `/api/cate/edit`
- **Method**: POST
- **Parameters**: `token` (required), plus body:
  - `id` (required): Category ID
  - `cate_name`: Category name (optional, only update provided fields)
  - `cate_dir`: Category directory (optional)
  - `seo_title`: SEO title (optional)
  - `keywords`: Keywords (optional)
  - `description`: Description (optional)
  - `sort`: Sort order (optional)
  - `is_show`: Show/hide (optional)
- **Response**:
```json
{
  "state": 1,
  "msg": "保存成功",
  "data": null
}
```

#### Delete Category

Delete a category.

- **URL**: `/api/cate/delete`
- **Method**: POST
- **Parameters**: `token` (required), `id` (required)
- **Response**:
```json
{
  "state": 1,
  "msg": "删除成功",
  "data": null
}
```

---

### Article APIs

#### List Articles

Get blog articles with pagination and filtering.

- **URL**: `/api/article/list`
- **Method**: GET
- **Parameters**:
  - `token` (required)
  - `page`: Page number (default: 1)
  - `rows`: Items per page (default: 10)
  - `cate_id`: Filter by category ID (optional)
  - `keyword`: Search keyword, searches in title and writer (optional)
- **Response**:
```json
{
  "state": 1,
  "msg": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "cate_id": 1,
        "user_id": 1,
        "title": "My Blog Post",
        "writer": "admin",
        "click": 100,
        "description": "Post summary",
        "add_time": 1577808000,
        "thumb": "",
        "cate_name": "melog",
        "cate_dir": "melog"
      }
    ],
    "page": 1,
    "rows": 10,
    "total": 25
  }
}
```

#### Get Article Detail

Get full details of a specific article including content.

- **URL**: `/api/article/detail`
- **Method**: GET
- **Parameters**: `token` (required), `id` (required)
- **Response**:
```json
{
  "state": 1,
  "msg": "success",
  "data": {
    "id": 1,
    "cate_id": 1,
    "user_id": 1,
    "title": "My Blog Post",
    "writer": "admin",
    "source": "",
    "source_url": "",
    "click": 100,
    "keywords": "melog,blog",
    "description": "Post summary",
    "content": "# Full article content in Markdown\n\n...",
    "thumb": "",
    "add_time": 1577808000,
    "update_time": 1631959741,
    "comment_count": 5,
    "comment_set": 0
  }
}
```

#### Create Article

Create a new blog article. The article content supports Markdown format.

- **URL**: `/api/article/create`
- **Method**: POST
- **Parameters**: `token` (required), plus body:
  - `title` (required): Article title
  - `cate_id` (required): Category ID
  - `content`: Article content in Markdown format (optional)
  - `writer`: Author name (optional)
  - `source`: Source name (optional)
  - `source_url`: Source URL (optional)
  - `keywords`: SEO keywords, comma-separated (optional)
  - `description`: Article summary/description (optional)
  - `thumb`: Thumbnail image URL (optional)
  - `comment_set`: Comment setting: 0=follow system, 1=force enable, -1=force disable (optional, default: 0)
- **Response**:
```json
{
  "state": 1,
  "msg": "新增成功",
  "data": { "id": 3 }
}
```

#### Edit Article

Update an existing article.

- **URL**: `/api/article/edit`
- **Method**: POST
- **Parameters**: `token` (required), plus body:
  - `id` (required): Article ID
  - `title`: Article title (optional)
  - `cate_id`: Category ID (optional)
  - `content`: Article content (optional)
  - `writer`: Author (optional)
  - `source`: Source (optional)
  - `source_url`: Source URL (optional)
  - `keywords`: Keywords (optional)
  - `description`: Description (optional)
  - `thumb`: Thumbnail URL (optional)
  - `comment_set`: Comment setting (optional)
- **Response**:
```json
{
  "state": 1,
  "msg": "保存成功",
  "data": null
}
```

#### Delete Article

Delete an article and its associated comments.

- **URL**: `/api/article/delete`
- **Method**: POST
- **Parameters**: `token` (required), `id` (required)
- **Response**:
```json
{
  "state": 1,
  "msg": "删除成功",
  "data": null
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "state": 0,
  "msg": "Error message",
  "data": null
}
```

Common error messages:
- Missing parameters (e.g. "缺少token参数", "缺少id参数")
- Token errors (e.g. "Token无效或已过期")
- Permission errors (e.g. "权限不足")
- Resource not found (e.g. "分类不存在", "文章不存在")
- Request method errors (e.g. "请使用POST请求")

## Permission System

Tokens have granular permissions using a bitmask system:

| Permission | Bit | Value | Description |
|-----------|-----|-------|-------------|
| Category Read | 0 | 1 | List/view categories |
| Category Create | 1 | 2 | Create categories |
| Category Edit | 2 | 4 | Edit categories |
| Category Delete | 3 | 8 | Delete categories |
| Article Read | 4 | 16 | List/view articles |
| Article Create | 5 | 32 | Create articles |
| Article Edit | 6 | 64 | Edit articles |
| Article Delete | 7 | 128 | Delete articles |

## Usage Examples

### Example 1: List all articles

```bash
curl "http://127.0.0.1:3003/api/article/list?token=ml_xxx"
```

### Example 2: Create a new article

```bash
curl -X POST "http://127.0.0.1:3003/api/article/create?token=ml_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Post",
    "cate_id": 1,
    "content": "# Hello World\n\nThis is my new blog post.",
    "keywords": "hello,world",
    "description": "A new blog post"
  }'
```

### Example 3: List categories

```bash
curl -H "Authorization: Bearer ml_xxx" \
  "http://127.0.0.1:3003/api/cate/list"
```

## Notes

- Article content supports **Markdown** format
- `add_time` and `update_time` are Unix timestamps (seconds)
- When deleting an article, all associated comments are also deleted
- Token expiration is checked on every request; expired tokens return `{state: 0, msg: "Token无效或已过期"}`
- The `user_id` for new articles is automatically set based on the token's associated account
