import React from 'react'
import { RainMeterMatchConfig} from '@/app/utils/indexedDB/RainMeterMatchStorage';
import RainMeterSettings from './RainMeterSettings';

interface PCInfoFieldTabContentProps {
    rainmeterConfig: RainMeterMatchConfig;
}

const PCInfoFieldTabContent = ({ rainmeterConfig }: PCInfoFieldTabContentProps) => {
  

    return (
        <div className="flex-1 overflow-y-auto p-6">
            <div className='mb-6 animate-fadein text-sm text-gray-600'>
                <p>
                    Configure which patterns to match for automatically populating PC information fields.
                </p>
                <p>
                    For example, if the pattern for workstation name is set to 
                    the regex pattern &ldquo;^WS-\d{3}$&rdquo;, any template field label matching this pattern will be auto-filled with the corresponding workstation name.
                </p>
            </div>

            <div className="max-w-2xl animate-fadein">
                <div className="grid grid-cols-2 gap-4">

                    <RainMeterSettings rainMeterParam={rainmeterConfig.workstation} />
                    <RainMeterSettings rainMeterParam={rainmeterConfig.macAddress} />
                    <RainMeterSettings rainMeterParam={rainmeterConfig.ipAddress} />
                    <RainMeterSettings rainMeterParam={rainmeterConfig.operatingSystem} />
                    <RainMeterSettings rainMeterParam={rainmeterConfig.osVersion} />
                    <RainMeterSettings rainMeterParam={rainmeterConfig.osBuild} />
                </div>
            </div>

        </div>
    ) 
}

export default PCInfoFieldTabContent