import React, { Component} from "react"
import ReactMapGL, { 
    Marker, 
    Popup, 
    FlyToInterpolator, 
    WebMercatorViewport 
} from "react-map-gl"
import { easeQuad} from "d3-ease"

export default class ResultsMap extends Component {
    constructor() {
        super()
        this.state = {
            viewport: {
                latitude: 41.881832,
                longitude: -87.623177,
                zoom: 10,
                width: "300px",
                height: "300px",
                maxZoom: 16
            }
        }
    }

    //  A slightly hacky bugfix for allowing mapbox markers to
    //  include clickable links and still be able to close
    componentDidUpdate = () => {
        if (document.getElementsByClassName("mapboxgl-popup-close-button").length > 0) {
            const x = document.getElementsByClassName("mapboxgl-popup-close-button")[0]
            x.addEventListener('click', () => this.props.handleClose())
        }
    }

    recenterMap = () => {
        if (this.props.currentGame.game) {
            const latArray = this.props.currentGame.game.donations.map(donationEntry => {
                return donationEntry.fundraiser.latitude
            }).sort()

            const longArray = this.props.currentGame.game.donations.map(donationEntry => {
                return donationEntry.fundraiser.longitude
            }).sort()

            const minMaxArray = [[longArray[0], latArray[0]], [longArray[longArray.length - 1], latArray[latArray.length - 1]]]

            const originalViewport = new WebMercatorViewport(this.state.viewport)
            const {longitude, latitude, zoom} = originalViewport.fitBounds(minMaxArray, {
                padding: 40
            })

            this.setState({
                viewport: {
                  ...this.state.viewport,
                  longitude,
                  latitude,
                  zoom,
                  bearing: 0,
                  pitch: 0,
                  transitionDuration: 2000,
                  transitionInterpolator: new FlyToInterpolator({}),
                  transitionEasing: easeQuad
                }
            })
        }
    }

    renderMarkers = () => {
        return this.props.currentGame.game.donations.map(donationEntry => {
            return <Marker key={`marker-${donationEntry.donation.id}`} 
                latitude={donationEntry.fundraiser.latitude}
                longitude={donationEntry.fundraiser.longitude}>
                    <button style={{transform: `translate(${-17}px,${-22}px)`}} className='marker-btn' onClick={() => this.props.handleClick(donationEntry)}><img src="/map-pushpin.svg" alt="Fundraiser Location"/></button>
            </Marker>
        })
    }

    render = () => {
        if (this.props.currentGame.game) {
            return (
                <div className="inner-map-container">
                    <button className="blue-buttons" onClick={this.recenterMap}>Return map to starting point</button>
                    <ReactMapGL 
                        {...this.state.viewport}
                        onLoad={this.recenterMap}
                        mapStyle='mapbox://styles/mgizzi3ru/ck8z3s4k001191jqtm6bp5rzx'
                        mapboxApiAccessToken="pk.eyJ1IjoibWdpenppM3J1IiwiYSI6ImNrOHQyemNmZjBhY3kzZW12ZmYycGJjMGUifQ.HDKamhzm23YZU9P54Dsibg"
                        onViewportChange={viewport => {
                            this.setState({
                                viewport: viewport
                            })
                        }}
                        >

                        {this.renderMarkers()}

                        {this.props.selectedFundraiser && this.props.selectedFundraiser.fundraiser ? 
                            <Popup 
                                latitude={this.props.selectedFundraiser.fundraiser.latitude} 
                                longitude={this.props.selectedFundraiser.fundraiser.longitude}
                                >

                                    <h4>{this.props.selectedFundraiser.fundraiser.name}</h4>
                                    <div id="fundraiser-link"><a href={this.props.selectedFundraiser.fundraiser.url}>Link</a></div>

                            </Popup>
                        : null}
                    </ReactMapGL>
                </div>
            )
        } else {
            return null
        }
    }
}