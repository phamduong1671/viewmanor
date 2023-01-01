import classNames from "classnames/bind";
import { useNavigate } from "react-router";
import { useContext, useEffect, useState, useMemo } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

import style from './PostsPublished.module.scss'
import InputContainer from '../inputContainer'
import { db } from '../../firebase.js'
import { PostContext } from '../../context/PostContext'
import Pagination from "../pagination";

let PageSize = 10;

function PostsPublished({ id }) {
    const cl = classNames.bind(style)
    const navigate = useNavigate()
    const { postDispatch } = useContext(PostContext)
    const [posts, setPosts] = useState([])
    const [personalPosts, setPersonalPosts] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState({})

    const currentTablePosts = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return posts.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, posts]);

    const currentTablePersonalPosts = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return personalPosts.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, personalPosts]);

    useEffect(() => {
        const fetchPosts = async () => {
            let list = []
            let list2 = []
            try {
                const querySnapshot = await getDocs(collection(db, "posts"));
                querySnapshot.forEach(doc => {
                    if (doc.data().ward.toLowerCase().search(search.wardSearch) !== -1 &&
                        doc.data().address.toLowerCase().search(search.addressSearch) !== -1
                    )
                        list.push({ id: doc.id, ...doc.data() })
                    if (doc.data().userId === id &&
                        doc.data().ward.toLowerCase().search(search.wardSearch) !== -1 &&
                        doc.data().address.toLowerCase().search(search.addressSearch) !== -1
                    )
                        list2.push({ id: doc.id, ...doc.data() })
                });
                setPosts(list)
                setPersonalPosts(list2)
            } catch (error) {
                console.log(error)
            }
        }
        fetchPosts();
    }, [id, search])

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
        postDispatch({ type: 'SHOW', payload: e.target.id })
        navigate('/post')
    }

    const handleSearch = (e) => {
        setSearch({ ...search, [e.target.id]: e.target.value })
    }

    return (
        <div className={cl('content')}>
            {id ?
                <div className={cl('header-content')}>Tin đã đăng</div>
                : <div className={cl('header-content')}>Quản lý tin đăng</div>
            }
            <div className={cl('header')}>
                <div>
                    <InputContainer id='thoigian' value='Tất cả' />
                </div>
                <div className={cl('header-right')}>
                    <input
                        id="wardSearch"
                        className={cl('box-search')}
                        placeholder='Tìm theo Xã / Phường'
                        onChange={e => handleSearch(e)}
                    />
                    <input
                        id="addressSearch"
                        className={cl('box-search')}
                        placeholder='Địa chỉ cụ thể'
                        onChange={e => handleSearch(e)}
                    />
                </div>
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
                            <th>Địa chỉ</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {id ?
                            currentTablePersonalPosts.map((post, index) => (
                                post.userId === id &&
                                <tr key={index}>
                                    <td>{post.id}</td>
                                    <td>{post.category}</td>
                                    <td>{post.type}</td>
                                    <td>{post.date}</td>
                                    <td>{post.ward}</td>
                                    <td>{post.address}</td>
                                    <td>
                                        <button
                                            id={post.id}
                                            title="Sửa"
                                            className={cl('btn-icon', 'btn-update')}
                                            onClick={(e) => handleUpdate(e)}
                                        ></button>
                                        <button
                                            id={post.id}
                                            title="Xóa"
                                            className={cl('btn-icon', 'btn-delete')}
                                            onClick={(e) => handleDelete(e.target.id)}
                                        ></button>
                                    </td>
                                </tr>
                            ))
                            : currentTablePosts.map((post, index) =>
                                <tr key={index}>
                                    <td>{post.id}</td>
                                    <td>{post.category}</td>
                                    <td>{post.type}</td>
                                    <td>{post.date}</td>
                                    <td>{post.ward}</td>
                                    <td>{post.address}</td>
                                    <td>
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
            <div className={cl('wrap-pagination')}>
                <div className={cl('page-info')}>
                    Hiển thị {currentPage * PageSize - PageSize + 1}
                    -
                    {currentPage * PageSize < posts.length ?
                        currentPage * PageSize
                        : posts.length}/{posts.length} tin
                </div>
                {!id &&
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={posts.length}
                        pageSize={PageSize}
                        onPageChange={page => setCurrentPage(page)}
                    />
                }
                {id &&
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={personalPosts.length}
                        pageSize={PageSize}
                        onPageChange={page => setCurrentPage(page)}
                    />
                }
                <div className={cl('page-info')}>
                    {PageSize} tin/trang
                </div>
            </div>
        </div>
    );
}



export default PostsPublished;
