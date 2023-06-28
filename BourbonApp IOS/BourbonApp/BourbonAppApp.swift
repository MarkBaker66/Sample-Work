//
//  BourbonAppApp.swift
//  BourbonApp
//
//  Created by Grayce Richards on 4/25/22.
//

import SwiftUI

@main
struct BourbonAppApp: App {
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
