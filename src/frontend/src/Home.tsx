import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/index.css';
import './css/styles.css';


const Home = () => {
    const [selectedIndex1, setSelectedIndex1] = useState<number>(0);
    const [selectedIndex2, setSelectedIndex2] = useState<number>(0);
    const [imageState1, setImageState1] = useState<number>(0);
    const [imageState2, setImageState2] = useState<number>(0);
    const [data, setData] = useState<any[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/images');
                    setData(response.data.data);
                } catch (error) {
                    console.log(error);
            }
        };
      
        fetchData();
    }, []);
      
    useEffect(() => {
        if (data) {
            const randomIndex1 = Math.floor(Math.random() * data.length);
            let randomIndex2;
            do {
                randomIndex2 = Math.floor(Math.random() * data.length);
            } while (randomIndex2 === randomIndex1);
        
            setSelectedIndex1(randomIndex1);
            setSelectedIndex2(randomIndex2);
        }
    }, [data]);
      
    const handleClick1 = () => {
        if (data) {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * data.length);
            } while (newIndex === selectedIndex1 || newIndex === selectedIndex2);
            const rating = {
                winner: selectedIndex1,
                loser: selectedIndex2
            };
            axios.post(
                'http://localhost:3001/api/rating',
                { reqData: rating }
            )
            setSelectedIndex2(newIndex);
        }
    };
      
    const handleClick2 = () => {
        if (data) {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * data.length);
            } while (newIndex === selectedIndex1 || newIndex === selectedIndex2);
            const rating = {
                winner: selectedIndex2,
                loser: selectedIndex1
            };
            axios.post(
                'http://localhost:3001/api/rating',
                { reqData: rating }
            )
            setSelectedIndex1(newIndex);
        }
    };
    
    const multipleFuncions1 = () => {
        handleClick2();
        setImageState1(1);
    }
    const multipleFuncions2 = () => {
        handleClick1();
        setImageState2(1);
    }

    return (
        <div className='parent-div'>
            <div className='main-header'>
                <p className='main-header-p'>FACEMASH</p>
            </div>
            <div className='main-div'>
                <div className='upper-h2-div'>
                    <p className='upper-h2-p'>Were we let in for our looks? No. Will we be judged on them? Yes.</p>
                </div>
                <div className='header'>
                    <p className='header-p'>Who's Hotter? Click to Choose.</p>
                </div>
                <div className='bottom-main'>
                    <div className='left-side'>
                        <div className='left-frame'>
                            {data && (
                                <React.Fragment>
                                    {selectedIndex1 !== 0 && (
                                        <img src={`data:image/png;base64,${data[selectedIndex1].data}`} alt="Image 1" onClick={multipleFuncions2} className='left-image' />
                                    )}
                                    {imageState1 === 1 && selectedIndex1 === 0 && (
                                        <img src={`data:image/png;base64,${data[selectedIndex1].data}`} alt="Image 1" onClick={handleClick1} className='left-image' />
                                    )}
                                    {imageState1 === 0 && selectedIndex1 === 0 && (
                                        <img src={`data:image/png;base64,${data[0].data}`} alt="Image 1" onClick={handleClick1} className='left-image' />
                                    )}
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                    <div className='middle-side'>
                        <p className='or'>OR</p>
                    </div>
                    <div className='right-side'>
                        <div className='right-frame'>
                            {data && (
                                <React.Fragment>
                                    {selectedIndex2 !== 0 && (
                                        <img src={`data:image/png;base64,${data[selectedIndex2].data}`} alt="Image 2" onClick={multipleFuncions1} className='right-image' />
                                    )}
                                    {imageState2 === 1 && selectedIndex2 === 0 && (
                                        <img src={`data:image/png;base64,${data[selectedIndex2].data}`} alt="Image 2" onClick={handleClick2} className='right-image' />
                                    )}
                                    {imageState2 === 0 && selectedIndex2 === 0 && (
                                        <img src={`data:image/png;base64,${data[0].data}`} alt="Image 2" onClick={handleClick2} className='right-image' />
                                    )}
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                </div>
                <div className='rest-parent-div'>
                    <div className='rest-upper'>
                        <div className='extra-div'></div>
                        <div className='rest-upper-inner'></div>
                    </div>
                    <div className='rest-down'>
                        <a href="" className='nav-buttons'>About</a>
                        <a href="/submit" className='nav-buttons'>Submit</a>
                        <a href="/rankings" className='nav-buttons'>Rankings</a>
                        <a href="" className='nav-buttons'>Previous</a>
                    </div>
                </div>
            </div>  
        </div>

    )
};

export default Home;