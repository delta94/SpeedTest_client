import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Table } from 'reactstrap';
import moment from 'moment';

import cls from './style.module.scss';

import userApi from '../../apis/userApi';

// Contexts
import { WaitingContext } from '../../components/providers/waitingProvider';
import { ToastContext } from '../../components/providers/toastProvider';

const LeaderBoard = () => {
  let [users, setUsers] = useState([]);
  let { setIsWaiting } = useContext(WaitingContext);
  let { toast } = useContext(ToastContext);

  const fetchData = async () => {
    try {
      let {
        status,
        data: { users },
      } = await userApi.getLeaderBoard();

      if (status !== 'success' || !users) {
        throw new Error('Có lỗi xảy ra');
      }

      setUsers(currentState => users);
      setIsWaiting(currentIsWaiting => false);
    } catch (error) {
      toast.error('Không tải được dữ liệu, vui lòng thử lại', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setIsWaiting(currentIsWaiting => false);
      return;
    }
  };

  useEffect(() => {
    setIsWaiting(currentIsWaiting => true);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Row>
        <Col className="col-md-8 offset-md-2 d-flex align-items-center">
          <div className={cls.leaderBoard}>
            <Table className="text-white table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Avatar</th>
                  <th>Tên</th>
                  <th>Tốc độ (Wpm)</th>
                  <th>Tỷ lệ sai (Accuracy)</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item, key) => {
                  return (
                    <tr key={key}>
                      <th>{key + 1}</th>
                      <th>
                        <div
                          className={cls.avatar}
                          style={{ backgroundImage: `url(${item.avatar})` }}
                        ></div>
                      </th>
                      <th>{item.name}</th>
                      <th>{item.score}</th>
                      <th>{item.accuracy}</th>
                      <th>{moment(item.dateCreate).fromNow()}</th>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LeaderBoard;
