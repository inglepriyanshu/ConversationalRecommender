import { NextResponse } from 'next/server';
import csv from 'csvtojson';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase() || '';

    if (!query) {
        return NextResponse.json({ results: [] });
    }

    try {
        // Updated path to match the correct CSV filename
        const csvFilePath = path.join(process.cwd(), 'RecAlgo', 'RecAlgo', 'NewDataset2_reindexed.csv');
        
        // Debug: Check if file exists and log absolute path
        try {
            const absolutePath = path.resolve(csvFilePath);
            console.log('Attempting to read CSV from:', absolutePath);
            
            await fs.access(csvFilePath);
            console.log('CSV file found successfully');
            
            const products = await csv().fromFile(csvFilePath);
            console.log('Total products loaded:', products.length);
            
            const results = products.filter(product => {
                const searchableFields = [
                    product.product_title,
                    product.category,
                    product.product_description,
                    product.sub_category,
                    product.brand
                ].filter(Boolean); // Remove any undefined/null values

                return searchableFields.some(field => 
                    field.toString().toLowerCase().includes(query)
                );
            });

            console.log(`Found ${results.length} matches for query: "${query}"`);
            return NextResponse.json({ results });

        } catch (err) {
            console.error('File access error:', err);
            // Try alternative path for development environment
            const altPath = path.join(process.cwd(), '..', 'RecAlgo', 'RecAlgo', 'NewDataset2_reindexed.csv');
            console.log('Trying alternative path:', altPath);
            
            const products = await csv().fromFile(altPath);
            const results = products.filter(product => {
                // ...same filtering logic as above...
                const searchableFields = [
                    product.product_title,
                    product.category,
                    product.product_description,
                    product.sub_category,
                    product.brand
                ].filter(Boolean);

                return searchableFields.some(field => 
                    field.toString().toLowerCase().includes(query)
                );
            });

            return NextResponse.json({ results });
        }

    } catch (error) {
        console.error('Search error details:', {
            error: error.message,
            stack: error.stack,
            cwd: process.cwd()
        });
        
        return NextResponse.json({ 
            error: 'Failed to search products',
            details: error.message,
            path: process.cwd()
        }, { status: 500 });
    }
}
