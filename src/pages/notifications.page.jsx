import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';
import { domain } from '../constants/domain';
import { UserContext } from '../App';
import { filterPaginationData } from '../common/filter-pagination-data';
import Loader from '../components/loader.component';
import AnimationWrapper from '../common/page-animation';
import NoDataMessage from '../components/nodata.component';
import NotificationCard from '../components/notification-card.component';
import LoadMoreDataBtn from '../components/load-more.component';

const Notifications = () => {
    const { userAuth: { access_token } } = useContext(UserContext);
    const [filter, setFilter] = useState("all");
    const [notifications, setNotifications] = useState(null);

    const filters = ['all', 'like', 'comment', 'reply'];

    const fetchNotification = ({ page, deletedDocCount = 0 }) => {
        axios.post(`${domain}/blog/notify/get-notifications`, { page, filter, deletedDocCount }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
            .then(async ({ data: { notification: data } }) => {
                let formattedData = await filterPaginationData({
                    state: notifications,
                    data,
                    page,
                    countRoute: "/blog/notify/get-All-notificationsCount",
                    data_toSend: { filter },
                    user: access_token
                });
                setNotifications(formattedData);
            })
            .catch(err => {
                console.log(err);
            });
    };

    useEffect(() => {
        if (access_token) {
            fetchNotification({ page: 1 });
        }
    }, [filter, access_token]);

    const handleFunctionClick = (e) => {
        setFilter(e.target.innerHTML);
        setNotifications(null);
    };

    return (
        <div>
            <h1 className='max-md:hidden'>Recent Notifications</h1>

            <div className='my-8 flex gap-6'>
                {filters.map((filterName, index) => (
                    <button
                        key={index}
                        className={`py-2 ${filter === filterName ? "btn-dark" : "btn-light"}`}
                        onClick={handleFunctionClick}
                        type="button"
                    >
                        {filterName}
                    </button>
                ))}
            </div>

            {notifications == null ? <Loader /> :
                <>
                    {notifications.results.length ? notifications.results.map((notification, i) => {
                        return (
                            <AnimationWrapper key={i} transition={{ delay: i * 0.08 }}>
                                <NotificationCard data={notification} index={i} notificationState={{ notifications, setNotifications }} />
                            </AnimationWrapper>
                        );
                    }) : <NoDataMessage message="Nothing is Available" />}
                </>
            }

            {notifications && (
                <LoadMoreDataBtn
                    state={notifications}
                    fetchDataFunc={fetchNotification}
                    additionalParam={{ deletedDocCount: notifications.deletedDocCount || 0 }}
                />
            )}
        </div>
    );
};

export default Notifications;
