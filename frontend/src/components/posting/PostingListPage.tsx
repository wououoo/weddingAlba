import PostingCard from "./component/PostingCard";
import "./styles/PostingPageStyle.css";
import {sampleDataList} from "./dto/PostingResponseDTO";


const PostingListPage: React.FC = () => {
    return <ul>
        {sampleDataList.map((post) => (
            <PostingCard
                postingId={post.postingId}
                title={post.title}
                simplyLocation={post.simplyLocation}
                appointmentDatetime={post.appointmentDatetime}
                location={post.location}
                perPay={post.perPay}
                wages={post.wages}
                tags={post.tags}
            />
        ))}
    </ul>;
}

export default PostingListPage;
