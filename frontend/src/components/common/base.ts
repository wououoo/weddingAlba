export const convertDatetime = (datetime: string): string => {
    if (!datetime) {
        return '';
    }

    try {
        const date = new Date(datetime);

        // Date 객체가 유효한지 확인
        if (isNaN(date.getTime())) {
            return '날짜/시간 변환 오류: 유효하지 않은 날짜/시간 값입니다.';
        }

        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더합니다.
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        // 시간을 두 자리 숫자로 포맷팅 (예: 9 -> "09")
        const formatTwoDigits = (num: number) => num.toString().padStart(2, '0');

        return `${year}년 ${month}월 ${day}일 ${formatTwoDigits(hours)}시 ${formatTwoDigits(minutes)}분`;
    } catch (error) {
        console.error("Error converting datetime:", error);
        return '날짜/시간 변환 오류';
    }
};

export const convertTime = (time: string): string => {
    if (!time) {
        return '';
    }

    if (time.includes('T')) {
        time = time.split('T')[1];
    }
    
    const timeParts = time.split(':');
    const hours = timeParts[0];
    const minutes = timeParts[1];

    return `${hours}시 ${minutes}분`;
}

export const convertPay = (payType: string, payAmount: string, workingHours: string) : string => {
    if(payType === 'DAILY') {
        const amount = Number(payAmount).toLocaleString();
        return `${amount}원`;
    } else if(payType === 'HOURLY') {
        const totalPay = Number(payAmount) * Number(workingHours);
        const amount = totalPay.toLocaleString();
        return `${amount}원`;
    } else {
        return '';
    }
}