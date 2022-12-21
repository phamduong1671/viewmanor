import { useMemo } from "react";

const range = (start, end) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, index) => index + start);
};

export const usePagination = ({
    totalCount,
    pageSize,
    siblingCount = 1,
    currentPage
}) => {
    const paginationRange = useMemo(() => {
        const totalPageCount = Math.ceil(totalCount / pageSize);

        // Số trang muốn hiển thị (gồm trang đầu, trang cuối, 2 phần dấu '...' và số trang hiển thị ở giữa)
        const totalPageNumbers = 2 * siblingCount + 5;

        // TH1: Số trang dữ liệu ít hơn số trang muốn hiển thị
        if (totalPageNumbers >= totalPageCount) {
            return range(1, totalPageCount);
        }

        // Trang ngoài cùng trái và phải của trang hiện tại
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(
            currentPage + siblingCount,
            totalPageCount
        );

        // không hiện dấu '...' khi trang hiện tại gần trang đầu hoặc trang cuối
        const showLeftDots = leftSiblingIndex > 2;
        const showRightDots = rightSiblingIndex < totalPageCount - 2;

        const firstPageIndex = 1;
        const lastPageIndex = totalPageCount;

        // Chỉ hiện dấu '...' bên phải
        if (!showLeftDots && showRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = range(1, leftItemCount);

            return [...leftRange, 'DOTS', totalPageCount];
        }

        // Chỉ hiện dấu '...' bên trái
        if (showLeftDots && !showRightDots) {

            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = range(
                totalPageCount - rightItemCount + 1,
                totalPageCount
            );
            return [firstPageIndex, 'DOTS', ...rightRange];
        }

        // Hiện cả dấu '...' phải và trái
        if (showLeftDots && showRightDots) {
            let middleRange = range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, 'DOTS', ...middleRange, 'DOTS', lastPageIndex];
        }
    }, [totalCount, pageSize, siblingCount, currentPage]);

    return paginationRange;
};