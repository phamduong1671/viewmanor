import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

import style from './PostsPublished.module.scss'
import InputContainer from '../inputContainer'
import { db } from '../../firebase.js'

function PostsPublished({ id }) {
    const cl = classNames.bind(style)
    const [posts, setPosts] = useState([])
    console.log(id);

    useEffect(() => {
        const fetchPosts = async () => {
            let list = []
            try {
                const querySnapshot = await getDocs(collection(db, "posts"));
                querySnapshot.forEach(doc => {
                    if (doc.data().userId === id)
                        list.push({ id: doc.id, ...doc.data() })
                });
                setPosts(list)
            } catch (error) {
                console.log(error)
            }
        }
        fetchPosts();
    }, [id])


    const handleDelete = async (id) => {
        if (window.confirm('Xóa tin đăng này?')) {
            try {
                await deleteDoc(doc(db, "posts", id));
                setPosts(posts.filter(item => item.id !== id))
            } catch (error) {
                console.log(error);
            }
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
                        {posts.map((post, index) =>
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
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}



export default PostsPublished;
