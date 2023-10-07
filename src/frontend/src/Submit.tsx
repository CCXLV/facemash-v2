import React, { useState } from 'react';
import axios from 'axios';
import './css/styles.css';
import './css/submit.css';


const Submit = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [inputValue, setPersonName] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPersonName(event.target.value);
    };
    

    const displayFileName = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target as HTMLInputElement;
    
        const fileName = fileInput.parentElement?.querySelector('.file-upload-span') as HTMLElement;
    
        if (fileName) {
            fileName.innerHTML = fileInput?.files?.[0].name ?? ''; 
            fileName.style.fontSize = '14px';
            fileName.style.color = '#454d55';
        }
    };
    
    

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target?.files?.[0]
        if (file) {
            setSelectedImage(file);
        }
    };

    const twoFunctionsOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        displayFileName(event);
        handleImageChange(event);
    };

    function readFile(file: File) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (event) {
                const dataURL = event?.target?.result as string; 
                const imageFile = {
                    name: file.name,
                    data: dataURL,
                };
                resolve(imageFile);
            };
            reader.readAsDataURL(file);
        });
    }

    const formSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Form submitted!");
    
        if (selectedImage) {
            const formData = new FormData();
            formData.append('image', selectedImage, selectedImage.name);
    
            readFile(selectedImage)
                .then(image => {
                    const data = {
                        image: image,
                        name: inputValue,
                    }
                    axios.post(
                        'http://localhost:3001/api/submit',
                        { data: data },
                    )
                        .then(r => window.location.reload())
                        .catch(e => console.log('error', e))
                });
        }
    };
    
      

    return (
        <div className='parent-div'>
            <div className='main-header'>
                <a href='/' className='main-header-p'>FACEMASH</a>
            </div>
            <div className='main-div'>
                <form method="post" onSubmit={formSubmit}>
                    <div className='form-header'>
                        <p className='form-header-p'>Submit an Image</p>
                    </div>
                    <div className='form-file-div'>
                        <label htmlFor="file-upload">
                            <span className='file-upload-span'>Upload Image</span>
                        </label>
                        <input type="file" id='file-upload' name="image" onChange={twoFunctionsOnChange}  className='form-file-input' />
                        <input type="text" value={inputValue} onChange={handleChange} placeholder='Name of the Person' className='name-input' required/>
                    </div>
                    <div className='submit-button-div'>
                        <button type='submit' className='submit-button'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default Submit;