const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const bucketName = 'urbanshield-frontend-dev';
const distPath = path.join(__dirname, '../dist');

// Basic mime types
const getMimeType = (ext) => {
  const mimes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain'
  };
  return mimes[ext.toLowerCase()] || 'application/octet-stream';
};

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

async function upload() {
  console.log(`Uploading to s3://${bucketName}...`);
  const files = walkSync(distPath);
  
  for (const file of files) {
    const key = path.relative(distPath, file).replace(/\\/g, '/');
    const ext = path.extname(file);
    const contentType = getMimeType(ext);
    
    const isHtml = ext === '.html';
    const cacheControl = isHtml 
      ? 'no-cache, no-store, must-revalidate' 
      : 'public, max-age=31536000, immutable';

    console.log(`Uploading ${key}...`);
    try {
      await s3.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: fs.createReadStream(file),
        ContentType: contentType,
        CacheControl: cacheControl
      }));
    } catch (e) {
      console.error(`Failed to upload ${key}:`, e.message);
    }
  }
  console.log('Upload complete!');
}

upload().catch(console.error);
