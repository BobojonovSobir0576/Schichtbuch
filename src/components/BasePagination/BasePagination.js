import Pagination from 'react-bootstrap/Pagination';
import { paginationRange } from '../../utils/index';

import './BasePagination.css'


function BasePagination(props) {

    let pageArray = paginationRange(props.totalPage, props.page, props.limit, props.siblings)

    return (
        <Pagination bsPrefix={`pagination pagination-lg ${props.darkMode ? 'pagination-bg' : ''}`} size='lg' >
            <Pagination.Prev onClick={() => props.onPageChange('previous')} >Zurück</Pagination.Prev>
            {pageArray.map((value, i) => {
                return value === props.page ?
                    <Pagination.Item className='bg-dark' onClick={() => props.onPageChange(value)} key={value + i} active >{value}</Pagination.Item>
                    :
                    <Pagination.Item onClick={() => props.onPageChange(value)} key={value + i} >{value}</Pagination.Item>
            })}
            <Pagination.Next onClick={() => props.onPageChange('next')} >Vor</Pagination.Next>
        </Pagination>
    );
}

export default BasePagination;