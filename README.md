# antd-crud-resource
CRUD data models using built-in components from antd 

## Example

```js
import React from 'react'
import Resource from 'antd-crud-resource'
import UserForm from './UserForm' // This is an antd form

export default class UserResource extends React.Component {
  onSave = (values, id) => {
    // api.update(id, values)
  }

  onRemove = (user) => {
    // api.delete(user.id)
  }

  render () {
    const {data} = this.props

    return <Resource
      name='User'
      data={data}
      fields={[
        {title: 'Email', dataIndex: 'email'},
        {title: 'Name', dataIndex: 'name'},
        {title: 'Active', dataIndex: 'active', render: v => v ? 'Yes' : 'No'}
      ]}
      form={UserForm}
      onSave={this.onSave}
      onRemove={this.onRemove}
    />
  }
}
```
