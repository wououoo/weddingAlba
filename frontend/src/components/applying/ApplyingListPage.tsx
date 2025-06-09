import ApplyingCard from "./component/ApplyingCard";
import "./styles/ApplyingPageStyle.css";
import {sampleApplyingList} from "./dto/ApplyingResponseDTO";


const ApplyingListPage: React.FC = () => {
    return (
        <ul>
            {sampleApplyingList.map((applying) => (
                <ApplyingCard
                    key={applying.applyId}
                    {...applying}
                />
            ))}
        </ul>
    );
}

export default ApplyingListPage;
