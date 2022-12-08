import classNames from "classnames/bind";

import style from './PostsPublished.module.scss'
import InputContainer from '../inputContainer'
import { useState } from "react";

function PostsPublished({ id }) {
    const cl = classNames.bind(style)
    const [posts, setPosts] = useState({})

    const handleDelete = (e) => {
        if (window.confirm('Xóa tin này?')) {
            let newPosts = posts.filter(item => JSON.stringify(item.id) !== e)
            setPosts(newPosts)
        }
    }

    const handleUpdate = (e) => {

    }

    return (
        <div className={cl('content')}>
            <div className={cl('header')}>
                <InputContainer id='thoigian' value='Tất cả' />
            </div>
            <div className={cl('wrap-table')}>
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Danh Mục</th>
                            <th>Loại</th>
                            <th>Ngày đăng</th>
                            <th>Xã / Phường</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {id ?
                            posts.map((post, index) => (post.userId === 2 ?
                                <tr key={index}>
                                    <td>{post.id}</td>
                                    <td>{post.category}</td>
                                    <td>{post.type}</td>
                                    <td>{post.date}</td>
                                    <td>{post.ward}</td>
                                    <td>
                                        <button
                                            title="Sửa"
                                            className={cl('btn-icon', 'btn-update')}
                                            onClick={(e) => handleUpdate(e.target.id)}
                                        ></button>
                                        <button
                                            id={post.id}
                                            title="Xóa"
                                            className={cl('btn-icon', 'btn-delete')}
                                            onClick={(e) => handleDelete(e.target.id)}
                                        ></button>
                                    </td>
                                </tr>
                                : null
                            ))
                            : posts.map((post, index) =>
                                <tr key={index}>
                                    <td>{post.id}</td>
                                    <td>{post.category}</td>
                                    <td>{post.type}</td>
                                    <td>{post.date}</td>
                                    <td>{post.ward}</td>
                                    <td>
                                        <button
                                            title="update"
                                            className={cl('btn-icon', 'btn-update')}
                                            onClick={(e) => handleUpdate(e.target.id)}
                                        ></button>
                                        <button
                                            id={post.id}
                                            title="delete"
                                            className={cl('btn-icon', 'btn-delete')}
                                            onClick={(e) => handleDelete(e.target.id)}
                                        ></button>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}



export default PostsPublished;
