import { useState } from 'react';
import { Modal, Button, Form, Table, Badge } from 'react-bootstrap';
import { Fragment } from 'react';
import moment from 'moment';
import { timeFormat } from '../../utils/index';
import {
  url,
  updated,
  fetchGet,
  fetchSearch,
  fetchSort,
} from '../../api/index';

import './BaseTable.css';

const BaseTable = ({
  data,
  darkMode,
  page,
  setDatLength,
  setTableData,
  isSort,
  setSearchData,
  searchFetch,
}) => {
  const [iconPosDatum, setIconPosDatum] = useState(true);
  const [iconPosSchicht, setIconPosSchicht] = useState(true);
  const [iconPosStatus, setIconPosStatus] = useState(true);
  const [iconPosPartnr, setIconPosPartnr] = useState(true);
  const [iconPosPartname, setIconPosPartname] = useState(true);
  const [iconPosMa, setIconPosMa] = useState(true);
  const [iconPosMashine, setIconPosMashine] = useState(true);
  const [show, setShow] = useState(false);
  const [noteComment, setNoteComment] = useState('');

  const [itemId, setItemId] = useState('');
  const [comments, setComments] = useState([]);

  const noteClass = 'text-success my-2';

  const statusColor = (status) => {
    if (status === 'info') {
      return '';
    } else if (status === 'anweisung') {
      return 'warning';
    } else {
      return 'danger';
    }
  };

  const handleClose = (str) => {
    setShow(false);
    if (str === 'save') {
      const FormData = require('form-data');
      const noteData = new FormData();
      noteData.append('notes', noteComment);
      updated(itemId, noteData).then((res) => {
        console.log(res);
        if (res.status === 200) {
          setNoteComment('');
          console.log(res.data)
          fetchGet(page).then((res) => {
            console.log(res)
            setTableData(res.data.items);
            setDatLength(res.data.length);
          });
          fetchSearch(...searchFetch).then((res) => {
            console.log(res.data)
            setSearchData(res?.data?.items);
          });
        }
      });
    } else {
      setNoteComment('');
    }
  };

  const handleShow = (id, com) => {
    setShow(true);
    setItemId(id);
    setComments(com);
  };

  const dateDay = (date) => {
    if (moment(date).format('dddd') === 'Monday') return 'Mo';
    if (moment(date).format('dddd') === 'Tuesday') return 'Di';
    if (moment(date).format('dddd') === 'Wednesday') return 'Mi';
    if (moment(date).format('dddd') === 'Thursday') return 'Do';
    if (moment(date).format('dddd') === 'Friday') return 'Fr';
    if (moment(date).format('dddd') === 'Saturday') return 'Sa';
    if (moment(date).format('dddd') === 'Sunday') return 'So';
  };

  const onDate = (date) => {
    return moment(date).format('DD.MM.YYYY');
  };
  const onHour = (date) => {
    return moment(date).format('HH:mm');
  };

  const onToUpperCase = (str) => {
    return str
      .split('')
      .map((item, i) => (i === 0 ? item.toUpperCase() : item))
      .join('');
  };

  const handelSort = (str) => {
    if (str === 'datum') {
      setIconPosDatum(!iconPosDatum);
      fetchSort(page, 'date', iconPosDatum ? 'asc' : 'desc').then((res) =>
        setTableData(res?.data?.items)
      );
    }
    if (str === 'schicht') {
      setIconPosSchicht(!iconPosSchicht);
      if (iconPosSchicht) {
        data.sort((a, b) => {
          if (timeFormat(onHour(a.date)) > timeFormat(onHour(b.date))) {
            return -1;
          }
          if (timeFormat(onHour(a.date)) < timeFormat(onHour(b.date))) {
            return 1;
          }
          return 0;
        });
      } else {
        data.sort((a, b) => {
          if (timeFormat(onHour(a.date)) > timeFormat(onHour(b.date))) {
            return 1;
          }
          if (timeFormat(onHour(a.date)) < timeFormat(onHour(b.date))) {
            return -1;
          }
          return 0;
        });
      }
    }
    if (str === 'status') {
      setIconPosStatus(!iconPosStatus);
      fetchSort(page, 'status', iconPosStatus ? 'desc' : 'asc').then((res) =>
        setTableData(res?.data?.items)
      );
    }
    if (str === 'partnr') {
      setIconPosPartnr(!iconPosPartnr);
      fetchSort(page, 'partnr', iconPosPartnr ? 'desc' : 'asc').then((res) =>
        setTableData(res?.data?.items)
      );
    }
    if (str === 'partname') {
      setIconPosPartname(!iconPosPartname);
      fetchSort(page, 'partname', iconPosPartname ? 'desc' : 'asc').then((res) =>
        setTableData(res?.data?.items)
      );
    }
    if (str === 'ma') {
      setIconPosMa(!iconPosMa);
      fetchSort(page, 'ma', iconPosMa ? 'desc' : 'asc').then((res) =>
        setTableData(res?.data?.items)
      );
    }
    if (str === 'mashine') {
      setIconPosMashine(!iconPosMashine);
      fetchSort(page, 'machine', iconPosMashine ? 'desc' : 'asc').then((res) =>
        setTableData(res?.data?.items)
      );
    }
  };

  return (
    <>
      <Table
        variant={`${darkMode ? 'dark' : 'with'}`}
        className="my-3 border border-white"
        responsive="sm"
        striped
        bordered
        hover
      >
        <thead className="bg_table_header text-white">
          <tr>
            <th>
              <div className="d-flex align-items-center justify-content-between">
                <span>Datum</span>
                {isSort ? (
                  <span
                    role="button"
                    onClick={() => handelSort('datum')}
                    className={`d-flex align-items-center ${
                      iconPosDatum ? 'icon_position' : ''
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-triangle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"
                      />
                    </svg>
                  </span>
                ) : null}
              </div>
            </th>
            <th>
              <div
                className="d-flex align-items-center justify-content-between"
                style={{ widows: '100%' }}
              >
                <span>Uhrzeit</span>
              </div>
            </th>
            <th>
              <div className="d-flex align-items-center justify-content-between">
                <span>Schicht</span>
                {isSort ? (
                  <span
                    role="button"
                    onClick={() => handelSort('schicht')}
                    className={`d-flex align-items-center ${
                      iconPosSchicht ? 'icon_position' : ''
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-triangle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"
                      />
                    </svg>
                  </span>
                ) : null}
              </div>
            </th>
            <th>
              <div className="d-flex align-items-center justify-content-between">
                <span>Status</span>
                {isSort ? (
                  <span
                    role="button"
                    onClick={() => handelSort('status')}
                    className={`d-flex align-items-center ${
                      iconPosStatus ? 'icon_position' : ''
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-triangle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"
                      />
                    </svg>
                  </span>
                ) : null}
              </div>
            </th>
            <th>
              <div className="d-flex align-items-center justify-content-between">
                <span>Partnr</span>
                {isSort ? (
                  <span
                    role="button"
                    onClick={() => handelSort('partnr')}
                    className={`d-flex align-items-center ${
                      iconPosPartnr ? 'icon_position' : ''
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-triangle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"
                      />
                    </svg>
                  </span>
                ) : null}
              </div>
            </th>
            <th>
              <div className="d-flex align-items-center justify-content-between">
                <span>PartName</span>
                {isSort ? (
                  <span
                    role="button"
                    onClick={() => handelSort('partname')}
                    className={`d-flex align-items-center ${
                      iconPosPartname ? 'icon_position' : ''
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-triangle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"
                      />
                    </svg>
                  </span>
                ) : null}
              </div>
            </th>
            <th>
              <div className="d-flex align-items-center justify-content-between">
                <span>MA</span>
              </div>
            </th>
            <th>
              <div className="d-flex align-items-center justify-content-between">
                <span>Ausstattung</span>
              </div>
            </th>
            <th className="width-not">Notiz</th>
            <th>Feedback</th>
            <th>Bild</th>
          </tr>
        </thead>
        <tbody className={darkMode ? 'bg_tbody-dark' : 'bg_tbody'}>
          {data.map((item, i) => {
            return item !== undefined ? (
              <Fragment key={item?.date + i}>
                <tr className={i % 2 === 0 ? 'bg_table_body' : ''}>
                  <td style={{ width: '140px' }}>
                    {dateDay(item.date)}, {onDate(item.date)}
                  </td>
                  <td>{onHour(item.date)}</td>
                  <td>{timeFormat(onHour(item.date))}</td>
                  <td className={`bg-${statusColor(item?.status)}`}>
                    {onToUpperCase(item.status)}
                  </td>
                  <td className='' style={{maxWidth:'30ch', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                      {`${String(item.partnr).slice(0, 16)}`}
                  </td>

                  <td className='' style={{maxWidth:'30ch', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                      {`${String(item.partname).slice(0, 39)}`}
                  </td>

                  <td>{item.ma}</td>
                  <td>
                    {item.machine.map((mach, i) => {
                      return (
                        <span className="mx-1 fs-5" key={mach + i}>
                          <Badge bg="secondary">{mach}</Badge>
                        </span>
                      );
                    })}
                  </td>
                  {/* item?.notes?.length - 1 */}
                  <td className="width-not">{item?.notes[0]?.note}</td>
                  <td>
                    <div className="d-flex flex-row justify-content-center">
                      <span
                        onClick={() => handleShow(item?.id, item.notes)}
                        className={`cursor_pointer mx-2 text-${
                          darkMode ? 'white' : 'dark'
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          className="bi bi-chat-text"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
                          <path d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8zm0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z" />
                        </svg>
                      </span>
                      ({item?.notes?.length})
                    </div>
                  </td>
                  <td className="">
                    <div className="d-flex justify-content-center align-items-center">
                      {item?.image ? (
                        <a
                          className={darkMode ? 'text-white' : 'text-dark'}
                          href={url + item.image}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-image"
                            viewBox="0 0 16 16"
                          >
                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />
                          </svg>
                        </a>
                      ) : (
                        '-'
                      )}
                    </div>
                  </td>
                </tr>
              </Fragment>
            ) : null;
          })}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose} scrollable={true} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Notiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <ul className="ul_style">
              {comments.map((item, i) => {
                return (
                  <li
                    key={item.created_at + i}
                    className={i % 2 === 0 ? noteClass : ''}
                  >
                    <Badge className="ms-2 me-2 py-2 px-2" bg="secondary">
                      {moment(item.created_at).format('DD.MM.YYYY, HH:mm')}
                    </Badge>
                    {item.note}
                  </li>
                );
              })}
            </ul>
          </Form.Group>
        </Modal.Body>
        <Modal.Title id="example-custom-modal-styling-title">
          <div className="px-4 py-2">
            <Form.Control
              placeholder="Feedback"
              onChange={(e) => setNoteComment(e.target.value)}
              value={noteComment}
              as="textarea"
              rows={2}
            />
          </div>
        </Modal.Title>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" onClick={() => handleClose('cancel')}>
            Abbruch
          </Button>
          <Button variant="primary" onClick={() => handleClose('save')}>
            Speichern
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BaseTable;
