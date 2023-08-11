import React, { useState } from 'react';
import AWS from 'aws-sdk'


const S3_BUCKET_TMP2 = 'kisttmp2-kr'
const S3_BUCKET_TMP2_OUTPUT = 'kisttmp2-vector-kr'

const REGION = 'ap-northeast-2'

// 
AWS.config.update({
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_KEY
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET_TMP2 },
    region: REGION,
})

const UploadImage = () => {

    
    const [progress2, setProgress2] = useState(0);
    
    const [retValue2, setRetValue2] = useState(0);
    
    const [selectedFile2, setSelectedFile2] = useState(null);
    


    const handleFileInput2 = (e) => {
        setSelectedFile2(e.target.files[0]);
        setProgress2('0');
        setRetValue2('')
    }



    const uploadFile2 = (file) => {

        var today = new Date();
        var year = today.getFullYear();
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var day = ('0' + today.getDate()).slice(-2);
        var hours = ('0' + today.getHours()).slice(-2);
        var minutes = ('0' + today.getMinutes()).slice(-2);
        var seconds = ('0' + today.getSeconds()).slice(-2);
        var dateString = year + month + day + '_' + hours + minutes + seconds;

        console.log(dateString.slice(2));
        const id2   = 'test';

        const params = {
            ACL: 'public-read',
            Body: file,
            Bucket: S3_BUCKET_TMP2,
            Key: id2 + '/' + dateString.slice(2) + '_' + file.name
        };

        const params_list = {
            Bucket: S3_BUCKET_TMP2_OUTPUT,
            Prefix: id2 + '/' + dateString.slice(2)

        };
        var fileNameArr = file.name.split(".");
        console.log(fileNameArr[0], fileNameArr[1]);

        const params_output = {
            Bucket: S3_BUCKET_TMP2_OUTPUT,
            Key: id2 + '/' + dateString.slice(2) + '_' + fileNameArr[0] + ".txt"

        };

        console.log(params.Key);
        myBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress2(Math.round((evt.loaded / evt.total) * 100))
            })
            .send((err) => {
                if (err) console.log("Upload Error", err)
                else
                    console.log("Upload Success")
            })

        var res = 0;
        var strData;
        let timer;
        let timer_interval = setInterval(() => {
            myBucket.listObjects(params_list, function (err, data) {
                if (err) {
                    console.log("Error", err);
                } else {
                    console.log("list contents length ", data.Contents.length);
                    if (data.Contents.length) {

                        myBucket.getObject(params_output, function (err, data) {
                            console.log("getobject");
                            if (err) {
                                console.log("Error", err);
                                setRetValue2('Error GetObject');
                            }
                            res = 1;
                            strData = data.Body.toString();
                            strData = strData.slice(0, 4)

                            setRetValue2(data.Body.toString());
                            clearInterval(timer_interval);
                            clearTimeout(timer);
                        })

                    }

                }
            })
        }, 5000);

        timer = setTimeout(() => {
            clearInterval(timer_interval);
            if (!res)
                setRetValue2('Error Processing');
        }, 60000);


    }



    return <div className='KistMain'>


        <h2>대상자 상태 분석 </h2>
        <p>Image File Upload Progress {progress2}%</p>
        <input type="file" onChange={handleFileInput2} />
        <button onClick={() => uploadFile2(selectedFile2)}> Upload</button>
 
        <div>
            <b>리턴값  : </b>
            {retValue2}
        </div>

        <hr></hr>


    </div>

}

export default UploadImage;