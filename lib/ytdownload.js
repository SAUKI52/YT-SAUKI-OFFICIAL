//*[ !! ] SCRAPER YT DOWNLOADER*
/**
My Ch: https://whatsapp.com/channel/0029Vai9MMj5vKABWrYzIJ2Z
Code Ori:
https://whatsapp.com/channel/0029VaiVeWA8vd1HMUcb6k2S/109
*/

import { post } from 'axios'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

const urls = {
    info: 'https://m8.fly.dev/api/info',
    download: 'https://m8.fly.dev/api/download'
}

const getHeaders = (extraHeaders = {}) => ({
    'Content-Type': 'application/json',
    'User-Agent': 'Downloader/1.0.0',
    'Referer': 'https://ytiz.xyz/',
    ...extraHeaders
})

const sendRequest = async (urlKey, data) => {
    const response = await post(urls[urlKey], data, { headers: getHeaders() })
    return response.data
}

const validateInput = (format, quality) => {
    const validFormats = ['m4a', 'mp3', 'flac']
    const validQualities = ['32', '64', '128', '192', '256', '320']

    if (!validFormats.includes(format)) {
        throw new Error(`Invalid format! Choose one of the following: ${validFormats.join(', ')}`)
    }

    if (!validQualities.includes(quality)) {
        throw new Error(`Invalid quality! Choose one of the following: ${validQualities.join(', ')}`)
    }
}

const ensureDirectoryExists = (filePath) => {
    const directoryPath = dirname(filePath)
    if (!existsSync(directoryPath)) {
        mkdirSync(directoryPath, { recursive: true })
    }
}

const fetchVideoDetails = async (url, format) => sendRequest('info', { url, format, startTime: 0, endTime: 0 })

const fetchAudio = async (url, quality, filename, randomID, format) => sendRequest('download', {
    url,
    quality,
    metadata: true,
    filename,
    randID: randomID,
    trim: false,
    startTime: 0,
    endTime: 0,
    format
})

const executeDownload = async (url, format = 'mp3', quality = '128') => {
    validateInput(format, quality)

    const videoDetails = await fetchVideoDetails(url, format)
    const audioDetails = await fetchAudio(url, quality, videoDetails.filename, videoDetails.randID, format)
    console.log(audioDetails)

    const outputDirectory = join(process.cwd(), 'downloads')
    const outputPath = join(outputDirectory, audioDetails.filename)
    ensureDirectoryExists(outputPath)

    const fileResponse = await post('https://m8.fly.dev/api/file_send', {
        filepath: audioDetails.filepath,
        randID: audioDetails.randID
    }, { responseType: 'arraybuffer' })

    writeFileSync(outputPath, fileResponse.data)
    console.log(`${outputPath}`)
}

const YTDownloader = {
    download: async (url, format = 'mp3', quality = '32') => {
        await executeDownload(url, format, quality)
    }
}

module.exports { YTDownloader }