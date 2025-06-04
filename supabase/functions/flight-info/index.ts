import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const flightNumber = url.searchParams.get('flight')
    const date = url.searchParams.get('date')

    console.log('Request parameters:', { flightNumber, date })

    if (!flightNumber || !date) {
      return new Response(
        JSON.stringify({ error: 'Flight number and date are required' }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      )
    }

    const apiKey = Deno.env.get('RAPIDAPI_KEY')
    console.log('API Key available:', !!apiKey)

    if (!apiKey) {
      throw new Error('RAPIDAPI_KEY environment variable is not set')
    }

    // Format flight number to remove any spaces or special characters
    const formattedFlightNumber = flightNumber.replace(/[^A-Z0-9]/gi, '')
    
    // Construct the API URL with the correct date format
    const formattedDate = date.split('T')[0] // Ensure we only use the date part
    const apiUrl = `https://aerodatabox.p.rapidapi.com/flights/number/${formattedFlightNumber}/${formattedDate}`
    
    console.log('Calling API:', apiUrl)

    const response = await fetch(apiUrl, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
      }
    })

    console.log('API Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error response:', errorText)
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    console.log('API Response data:', JSON.stringify(data, null, 2))

    // Format the response to match our needs
    const formattedData = Array.isArray(data) && data.length > 0 ? {
      departure: {
        airport: {
          iata: data[0].departure.airport.iata,
          name: data[0].departure.airport.name,
          municipalityName: data[0].departure.airport.municipalityName,
          countryCode: data[0].departure.airport.countryCode
        },
        scheduledTime: data[0].departure.scheduledTime
      },
      arrival: {
        airport: {
          iata: data[0].arrival.airport.iata,
          name: data[0].arrival.airport.name,
          municipalityName: data[0].arrival.airport.municipalityName,
          countryCode: data[0].arrival.airport.countryCode
        },
        scheduledTime: data[0].arrival.scheduledTime
      }
    } : null

    if (!formattedData) {
      throw new Error('No flight data found')
    }

    return new Response(
      JSON.stringify(formattedData),
      { 
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
})