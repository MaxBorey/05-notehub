import React from 'react';
import ReactPaginate from 'react-paginate';
import styles from './Pagination.module.css';

interface PaginationProps {
  pageCount: number;
  forcePage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pageCount, forcePage, onPageChange }) => (
  <ReactPaginate
    previousLabel="<"
    nextLabel=">"
    breakLabel="..."
    pageCount={pageCount}
    forcePage={forcePage}
    marginPagesDisplayed={2}
    pageRangeDisplayed={3}
    onPageChange={onPageChange}
    containerClassName={styles.pagination}
    pageClassName=""
    previousClassName=""
    nextClassName=""
    breakClassName=""
    activeClassName={styles.active}
    disabledClassName={styles.disabled}
    pageLinkClassName=""
    previousLinkClassName=""
    nextLinkClassName=""
    breakLinkClassName=""
    renderOnZeroPageCount={null}
  />
);

export default Pagination;
