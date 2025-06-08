import PostingCard from "./component/PostingCard";
import "./styles/PostingPageStyle.css";
import {sampleDataList} from "./dto/PostingResponseDTO"; // sampleDataList는 더 이상 사용되지 않으므로 주석 처리하거나 제거할 수 있습니다.

// const samplePosting:any[]= [
//     {
//         postingId: 1,
//         userId: 101,
//         title: '친구 결혼식 도우미 모집',
//         simplyLocation:'서울 강남',
//         appointmentDatetime: '2025년 06월 20일 15시',
//         registrationDatetime: '2025년 05월 18일 10시 30분',
//         location: '서울시 강남구 예식홀 1층',
//         isSelf: 0,
//         personName: '이민수',
//         personPhoneNumber: '010-1234-5678',
//         hasMobileInvitation: 1,
//         perPay : '일급',
//         wages: '50,000원',
//         tags: [
//             '친구대행',
//             '당일지급'
//         ]
//     },
//     {
//         postingId: 2,
//         userId: 102,
//         title: '내 결혼식 도와주실 분 구해요!',
//         simplyLocation:'부산 해운대',
//         appointmentDatetime: '2025년 07월 10일 11시',
//         registrationDatetime: '2025년 05월 17일 14시 20분',
//         location: '부산 해운대 더베이 101',
//         isSelf: 1,
//         personName: '정윤아',
//         personPhoneNumber: '010-9876-5432',
//         hasMobileInvitation: 0,
//         perPay : '시급',
//         wages: '15,000원',
//         tags: [
//             '급구',
//             '당일지급'
//         ]
//     },
//     {
//         postingId: 3,
//         userId: 103,
//         title: '사촌 결혼식 도와주실 분 구합니다',
//         simplyLocation:'대전 중구',
//         appointmentDatetime: '2025년 08월 05일 13시 30분',
//         registrationDatetime: '2025년 05월 15일 09시 00분',
//         location: '대전 중구 사랑웨딩홀',
//         isSelf: 0,
//         personName: '최현우',
//         personPhoneNumber: '010-5555-6666',
//         hasMobileInvitation: 1,
//         perPay : '일급',
//         wages: '60,000원',
//         tags: [
//             '급구',
//             '교통비지원'
//         ]
//     }
// ]



const PostingListPage: React.FC = () => {
    return <ul>
        {sampleDataList.map((post) => (
            <PostingCard
                key={post.postingId}
                {...post}
            />
        ))}
    </ul>;
}

export default PostingListPage;
