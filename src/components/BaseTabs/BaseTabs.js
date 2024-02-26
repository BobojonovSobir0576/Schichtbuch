import { useState, useEffect } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import moment from 'moment';
import BaseTable from '../BaseTable/BaseTable';
import BasePagination from '../BasePagination/BasePagination';
import BaseFormCreate from '../BaseCreatetable/BaseCreatetable';
import BaseSearchPage from '../BaseSearchPage/BaseSearchPage';
import { fetchGet } from "../../api/index"

import './BaseTabs.css'

function BaseTabs({ darkMode }) {

    const onlineDate = moment().format('DD.MM.YYYY // HH:mm')

    const [tableData, setTableData] = useState([])
    const [key, setKey] = useState('ubersicht');
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [datLength, setDatLength] = useState([])

    const [totalPage, setTotalPage] = useState(Math.ceil(datLength / limit))

    const handlePageChange = (value) => {
        if (value === "... ") {
            setPage(1)
        } else if (value === "previous") {
            if (page !== 1) setPage(page - 1)
        } else if (value === 'next') {
            if (page !== totalPage) setPage(page + 1)
        } else if (value === " ...") {
            setPage(totalPage)
        } else {
            setPage(value)
        }
    }

    if (limit > 10) {
        setLimit(10)
    }


    useEffect(() => {
        fetchGet(page).then(res => {
            setTableData(res?.data?.items)
            setDatLength(res?.data?.length)
        })
    }, [page])

    useEffect(() => {
        setTotalPage(Math.ceil(datLength / limit))
    }, [datLength, limit])

    return (

        <div className='w-100 position-relative' >
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className={`bg_tab_header ${darkMode ? 'bg-dark border border-white' : ''}`}
            >
                <Tab tabClassName={`fs-5 fw-bold border-0 rounded-0 text-${key === 'neu' ? 'dark' : darkMode ? 'white' : 'dark'}`} eventKey="neu" title="+ NEU">
                    <BaseFormCreate darkMode={darkMode} page={page} setTableData={setTableData} setKey={setKey} />
                </Tab>
                <Tab tabClassName={`fs-5 fw-bold border-0 rounded-0 text-${key === 'ubersicht' ? 'dark' : darkMode ? 'white' : 'dark'}`} eventKey="ubersicht" title="Übersicht">
                    <BaseTable
                        darkMode={darkMode}
                        data={tableData}
                        page={page}
                        setTableData={setTableData}
                        setDatLength={setDatLength}
                        isSort={true}
                    />
                    <div className='d-flex justify-content-center paginationTable'>
                        <BasePagination
                            darkMode={darkMode}
                            totalPage={totalPage}
                            page={page}
                            limit={limit}
                            siblings={1}
                            datLength={datLength}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </Tab>
                <Tab tabClassName={`fs-5 fw-bold border-0 rounded-0 text-${key === 'suche' ? 'dark' : darkMode ? 'white' : 'dark'}`} eventKey="suche" title="Suche">
                    <BaseSearchPage
                        darkMode={darkMode}
                        setTableData={setTableData}
                        setDatLength={setDatLength}
                    />
                </Tab>
            </Tabs>
            <span className={`d-none d-md-block position-absolute top-0 end-0 translate-middle-x d-flex align-items-center mt-2 text-${darkMode ? 'white' : 'dark'}`} >{onlineDate}</span>
        </div>
    );
}

export default BaseTabs;