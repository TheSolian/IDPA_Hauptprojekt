import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { useEffect, useState } from "react";
  import { Button } from "./ui/button";
  import { Input } from "@/components/ui/input";
  import { Checkbox } from "@/components/ui/checkbox";
  import { collection, getDocs, doc } from 'firebase/firestore'
  import { db } from '@/firebase'
  import { Label } from "@/components/ui/label"
    
  interface MultipleChoiceCreationProps {}
  
  const MultipleChoiceCreation: React.FC<MultipleChoiceCreationProps> = ({}) => {
    const [category, setCategory] = useState<string | undefined>();

    const [allCategories, setAllCategories] = useState<string[]>([]);

    async function getCategories(){
        const cats = await getDocs(collection(db, 'categories'))
        const categoriesArray:string[] = [];
        
        cats.forEach((doc) => {
          categoriesArray.push(doc.data().title);
        });
      
        setAllCategories(categoriesArray);
      }
      

    useEffect(() => {
        getCategories()
        console.log(allCategories)
    },[]);

    return (
      <>
        <div className="flex items-center justify-center m-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Category</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Categories</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
                {allCategories.map((category) => (
                    <DropdownMenuRadioItem value= {category} >{category}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
  
        <div className="flex flex-col items-center w-1/2 mx-auto">

            <div className="grid gap-3.5 mb-8 flex items-center space-x-2 mr-11">
            <Label htmlFor="email">Titel</Label>
            <Input type="email" placeholder="Value 1" className="p-3 mr-7 " />
            </div>
            <Label htmlFor="email" className="grid gap-3.5 flex items-center space-x-2 mr-44 mb-3.5">Antworten</Label>
          <div className="mb-4 flex items-center space-x-2">
            <Input type="email" placeholder="Value 1" className="mr-2" />
            <Checkbox id="terms1" className="rounded-[3px]" />
          </div>
  
          <div className="mb-4 flex items-center space-x-2">
            <Input type="email" placeholder="Value 2" className="mr-2" />
            <Checkbox id="terms2" className="rounded-[3px]" />
          </div>
  
          <div className="mb-4 flex items-center space-x-2">
            <Input type="email" placeholder="Value 3" className="mr-2" />
            <Checkbox id="terms3" className="rounded-[3px]" />
          </div>
  
          <div className="mb-4 flex items-center space-x-2">
            <Input type="email" placeholder="Value 4" className="mr-2" />
            <Checkbox id="terms4" className="rounded-[3px]" />
          </div>
        </div>
      </>
    );
  };
  
  export default MultipleChoiceCreation;
  