import { Badge, Stack } from "react-bootstrap";

interface genTagsProps {
    tags: string[],
    id: string,
    className: string
}


function tags({tags,id,className}:genTagsProps) {
  return(
    <>
    <h5>
    <Stack direction="horizontal" gap={2} className={className}>
        {tags.map((tag: String, tagIndex:number) => 
            <Badge
            className="p-2" 
            key={`${id}.1.${tagIndex}`}
            bg="primary">
            {tag}
            </Badge>
        )}
    </Stack>
    </h5>
    </>
  );
}

export default tags;