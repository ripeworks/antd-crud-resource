import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Popconfirm, Button, Input } from 'antd'

const filterResults = (filter, {data, fields}) => {
  const reg = new RegExp(filter, 'gi')
  return data.filter(row => {
    const fieldValues = fields.map(field => field.dataIndex)
    const matches = fieldValues.filter(field => !!String(row[field]).match(reg))
    return matches.length > 0
  })
}

export default class extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    data: PropTypes.array,
    fields: PropTypes.array.isRequired,
    form: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onRemove: PropTypes.func,
    rowActions: PropTypes.func,
    tableProps: PropTypes.object,
    loading: PropTypes.bool
  }

  static defaultProps = {
    data: [],
    loading: false
  }

  state = {
    editModel: null,
    showModal: false,
    filtered: false,
    search: ''
  }

  onSave = () => {
    const {editModel} = this.state
    const id = editModel ? editModel.id : null

    this.form.validateFields((err, values) => {
      if (err) return

      this.props.onSave(values, id)
        .then(res => {
          this.form.resetFields()
          this.setState({editModel: null, showModal: false})
        })
    })
  }

  onEdit = (editModel) => {
    this.setState({editModel, showModal: true})
  }

  onNew = () => {
    this.setState({editModal: null, showModal: true})
  }

  onCancel = () => {
    this.setState({editModel: null, showModal: false})
  }

  onSearch = (e) => {
    const filtered = filterResults(e.target.value, this.props)
    this.setState({search: e.target.value, filtered})
  }

  componentWillReceiveProps (nextProps) {
    const {search} = this.state

    if (search && this.props.data !== nextProps.data) {
      const filtered = filterResults(search, nextProps)
      this.setState({filtered})
    }
  }

  render () {
    const {name, fields, onRemove, onSave, rowActions, loading, tableProps} = this.props
    const data = this.state.filtered || this.props.data || []
    const Form = this.props.form

    return <div>
      <div className='search'>
        <Input.Search onChange={this.onSearch} value={this.state.search} />
      </div>
      <Table
        dataSource={data}
        loading={loading}
        rowKey='id'
        columns={[
          ...fields,
          {
            title: 'Action',
            key: 'action',
            render: (_, record) => <span>
              {rowActions && rowActions(record)}
              {onSave && <a role='button' onClick={() => this.onEdit(record)}>Edit</a>}
              {onRemove && <span className='ant-divider' />}
              {onRemove &&
                <Popconfirm title='Are you sure?' onConfirm={() => onRemove(record)}>
                  <a role='button'>Delete</a>
                </Popconfirm>
              }
            </span>
          }
        ]}
        footer={() =>
          <Button size='large' type='primary'
            onClick={this.onNew}>Add New {name}</Button>
        }
        {...tableProps}
      />
      <Form
        visible={this.state.showModal}
        ref={(c) => { this.form = c }}
        initial={this.state.editModel}
        onCancel={this.onCancel}
        onCreate={this.onSave}
      />
    </div>
  }
}
