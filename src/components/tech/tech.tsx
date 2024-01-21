import { Container, Accordion } from "react-bootstrap";
import { useState, useEffect } from "react";
import * as InterViewApi from "../../api/learning";

interface Interview {
  id: number;
  category: string;
  question: string;
  answer: string;
}

const Tech = () => {
  const [interview, setInterview] = useState<Interview[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("BACKEND");

  const fetchData = async (category: string) => {
    try {
      let response = await InterViewApi.getInterviewList(category);

      if (response) {
        setInterview(response.data.list);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const renderContentWithImages = (content: string) => {
    const imageUrlMatches = content.match(/https:\/\/img1\.daumcdn\.net.*?\.png/g);

    if (imageUrlMatches && imageUrlMatches.length > 0) {
      const images = imageUrlMatches.map((imageUrl, index) => (
        <img key={index} src={imageUrl} alt={`Image ${index}`} />
      ));

      const lastImageIndex = imageUrlMatches.length - 1;
      const textWithoutImages = content.split(imageUrlMatches[lastImageIndex]).join('');

      return (
        <div>
          {images}
          <p dangerouslySetInnerHTML={{ __html: textWithoutImages.replace(/\n/g, '<br>') }} />
        </div>
      );
    }

    return <p dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />;
  };

  return (
    <Container className="page__sub">
      <div className="box__select">
        <select className="form__select" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="BACKEND">백앤드</option>
          <option value="FRONT">프론트</option>
          <option value="AGDS">알고리즘&자료구조</option>
          <option value="OS">운영체제</option>
          <option value="NETWORK">네트워크</option>
          <option value="DATABASE">데이터베이스</option>
          <option value="CRYPTO">암호학</option>
          <option value="SECURITY">보안</option>
        </select>
      </div>
      <Accordion>
        {interview.map((data) => (
          <Accordion.Item key={data.id} eventKey={data.id.toString()}>
            <Accordion.Header>{data.question}</Accordion.Header>
            <Accordion.Body>
              {renderContentWithImages(data.answer)}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
};

export default Tech;