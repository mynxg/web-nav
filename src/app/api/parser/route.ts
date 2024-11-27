import { NextRequest, NextResponse } from "next/server";
// import axios from "axios";

export async function POST(request: NextRequest) {
    //获取环境变量，后端接口地址
    const apiUrl = process.env.VIDEO_APP_API_URL;
    const { url } = await request.json();

    if (!url) {
        return NextResponse.json({ error: "Please provide a valid Bilibili video URL." }, { status: 400 });
    }

    try {
        
        const response = await fetch(apiUrl+`/api/v1/video/parser_url?url=${encodeURIComponent(url)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();

        //return NextResponse.json({ videoUrl: data.data.url });
        return NextResponse.json({  dataResponse: data });
    } catch (error) {
        console.error("下载失败:", error);

        try {
            const response = await fetch("/api/down", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
              });
              const dataRes = await response.json();
              return NextResponse.json({ dataResponse: dataRes.videoUrl });   
        }catch (error) {
            console.error("下载失败:", error);
            return NextResponse.json({ error: "Download failed." }, { status: 500 });
        }
    }

}